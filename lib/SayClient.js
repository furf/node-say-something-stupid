var sys       = require('sys'),
    crypto    = require('crypto'),
    exec      = require('child_process').exec,
    IoClient  = require('IoClient'),
    
    publicDir = 'public',
    soundsDir = 'sounds';

function SayClient (client) {
  IoClient.prototype.constructor.call(this, client);
}

sys.inherits(SayClient, IoClient);

SayClient.prototype.handleMessage = function (data) {

  var self  = this,
      text  = data.text,
      voice = data.voice,
      hash  = crypto.createHash('md5').update(voice + text).digest('hex'),
      file  = '/' + soundsDir + '/' + hash + '.aiff',
      cmd   = [],
      res;

  if (text) {
    
    // Audio conversion uses say
    cmd.push('say');

    // Optionally, apply specified voice
    voice && cmd.push('-v', voice);

    // Dump to file
    cmd.push('-o', publicDir + file);
    
    // Add message
    cmd.push('"' + text + '"');

    // Execute command
    exec(cmd.join(' '), function (err, stdout, stderr) {
      
      // If successful, return the filename to the client
      if (!err) {
        self.broadcastAll({
          voice: voice,
          text:  text,
          file:  file
        });
      }
      
    });
  }
};

module.exports = SayClient;