(function (window, document, $) {

  var form        = $('#sayForm').submit(handleFormSubmit),
      voiceSelect = $('#voice'),
      textInput   = $('#text').keypress(handleKeyPress),
      messageList = $('#messages'),
      socket      = new io.Socket(),
      connected   = false,
      poller      = null,
      interval    = 1000;
      iframeCount = 0;

  socket.on('connect', handleSocketConnect);
  socket.on('message', handleSocketMessage);
  socket.on('disconnect', handleSocketDisconnect);

  startSocketPoller();
  
  function startSocketPoller () {
    console.log('startSocketPoller');
    if (!connected) {
      socket.connect();
      poller = window.setTimeout(startSocketPoller, interval);
    }
  }

  function stopSocketPoller () {
    console.log('stopSocketPoller');
    window.clearTimeout(poller);
    poller = 0;
  }

  function handleSocketMessage (data) {
    displayMessage(data);
  }

  function displayMessage (data) {
    var name = 'message-' + iframeCount++;
    $('<li/>')
      .addClass('update message')
      .append(
        $('<span class="voice"/>').text(data.voice + ': '),
        $('<a class="text"/>').attr({ href: data.file, target: name }).text(data.text)
      )
      .addToMessageList(function () {
        $('<iframe/>').attr({ name: name, src: data.file }).appendTo(this);
      });
  }
    
  function handleSocketConnect () {
    
    stopSocketPoller();
    connected = true;
    
    $('<li/>')
      .addClass('update announcement connect')
      .append(
        $('<span class="text">You are now connected.</span>')
      )
      .addToMessageList();
  }
  
  function handleSocketDisconnect () {

    $('<li/>')
      .addClass('update announcement disconnect')
      .append(
        $('<span class="text">You have been disconnected</span>')
      )
      .addToMessageList();

      connected = false;
      startSocketPoller();
  }

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
  
  $.fn.addToMessageList = function (callback) {
    return this.prependTo(messageList).slideDown('fast').fadeIn('fast', callback);
  };
  
})(this, this.document, this.jQuery);
