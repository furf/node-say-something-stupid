(function (window, document, $) {

  var speakForm   = $('#sayForm').submit(handleFormSubmit),
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
      speakForm.submit();
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
    var id = 'message-' + iframeCount++;
    $('<li/>')
      .append(
        $('<span class="voice"/>').text(data.voice + ': '),
        $('<a class="text"/>').attr({ href: data.file, target: id }).text(data.text)
      )
      .prependTo(messageList)
      .slideDown('fast')
      .fadeIn('fast', function () {
        $('<iframe/>').attr({ id: id, src: data.file }).appendTo(this);
      });
  }
  
})(this, this.document, this.jQuery);
