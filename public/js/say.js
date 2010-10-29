(function (window, document, $) {

  var form        = $('#sayForm').submit(handleFormSubmit),
      voiceSelect = $('#voice'),
      textInput   = $('#text').keypress(handleKeyPress),
      messageList = $('#messages'),
      socket      = new io.Socket(),
      iframeCount = 0;

  socket.connect();
  socket.on('message', handleSocketMessage);

  function handleKeyPress (evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      form.submit();
    }
  }
  
  function handleFormSubmit (evt) {
    evt.preventDefault();
    sendMessage(voiceSelect.val(), textInput.val());
    textInput.val('');
  }

  function sendMessage (voice, text) {
    socket.send({
      voice: voice,
      text:  text
    });
  }
  
  function handleSocketMessage (data) {
    var name = 'message-' + iframeCount++;
    $('<li/>')
      .append(
        $('<span class="voice"/>').text(data.voice + ': '),
        $('<a class="text"/>').attr({ href: data.file, target: name }).text(data.text)
      )
      .prependTo(messageList)
      .slideDown('fast')
      .fadeIn('fast', function () {
        $('<iframe/>').attr({ name: name, src: data.file }).appendTo(this);
      });
  }
  
})(this, this.document, this.jQuery);
