(function($) {
  var BulletList = React.createClass({displayName: "BulletList",
    // Standard React API
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("ul", null, 
          
            $.map(this.getAllItems(), function(pair, index) {
              return React.createElement("li", null, pair.value.text)
            })
          
          ), 
          React.createElement("input", {id: "item-to-add", type: "text"}), 
          React.createElement("input", {id: "add-button", type: "button", onClick: this.onAddButtonClick})
        )
      );
    },
    getInitialState: function() {
      return {data: {}, users: []};
    },
    componentDidMount: function() {
      // init sequence - Wave
      var self = this;

      function onWaveUpdate() {
        self.setState({data: wave.getState(), users: wave.getParticipants()});
      }

      function init() {
        if (wave && wave.isInWaveContainer()) {
          wave.setStateCallback(onWaveUpdate);
          wave.setParticipantCallback(onWaveUpdate);
        }
      }

      gadgets.util.registerOnLoadHandler(init);
    },
    // Our own code
    onAddButtonClick: function() {
      $('#add-button').click(function() {
        var newItem = $.trim($('#item-to-add').val());
        if (newItem.length > 0) {
          this.addItem(newItem);
        }
      });
    },
    addItem: function(newItem) {
      var newEntry = {};
      var randomId = Math.random().toString(16).replace('0.', '');
      var newId = "item_" + randomId;
      newEntry[newId] = {timestamp: new Date().getTime(), text: newItem};

      // optimistic local update
      this.setState({data: $.extend(this.state.data, newEntry), users: this.state.users});
      // remote update
      wave.submitDelta(newEntry);
    },
    getAllItems: function() {
      return $.map(this.state.data, function(value, key) {
        return {key: key, value: value}
      }).sort(function(a, b) {
        return a.value.timestamp - b.value.timestamp;
      });
    },
  });

  React.render(
    React.createElement(BulletList, {data: {}, users: []}),
    document.body
  );
})(jQuery);