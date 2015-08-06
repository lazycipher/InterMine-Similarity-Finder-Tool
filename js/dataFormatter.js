var _ = require('underscore'),
Cymine = function(records) {
  this.records = records;
  function toNodesAndEdges(records, parentNode){
    var d = {
      nodes : [],
      edges : []
    };

    for (var i in records) {
      var thisNode, row = records[i];
      thisNode = recordToNode(row);

      if(row.interactions) {
        //recursively make the interactions into nodes,
        //because node entities are nested at two levels.
        d = _.extend(d, toNodesAndEdges(row.interactions, thisNode));
      } else {
        //if it doesn't have an interaction list, it probably *is* an interaction
        //and thus needs to be an edge
        d.edges.push(interactionToEdge(parentNode, thisNode));

      }
      d.nodes.push(thisNode);
    }

    return d;
  };
  var recordToNode = function (obj) {
    var ret, data = {};
    ret = obj.gene2 ? obj.gene2 : obj;
    return {
      data : {
        details : getDetails(obj),
        label   : nameNode(obj),
        class   : ret.class,
        interactionType : getInteraction(obj),
        symbol  : ret.symbol,
        id : ret.primaryIdentifier //cytoscape needs strings, not ints
      }
    }
  };
  var getDetails = function(obj) {
    return obj.details ? obj.details[0] : {};
  }
  getInteraction = function(obj){
    var ret;
    if (obj.details) {
      ret = obj.details[0].type;
    }
    return ret;
  },
  nameNode = function(obj) {
    if (obj.gene2 && obj.gene2.symbol) {
      return obj.gene2.symbol;
    } else if (obj.symbol) {
      return obj.symbol;
    } else if (obj.details) {
      return obj.details[0].name;
    } else {
      return "NAME MISSING";
    }
  },
  interactionToEdge = function(node, node2) {
    return {
      data : {
        source : node.data.id,
        target : node2.data.id,
        interactionType : node2.data.details.type
      }
    };
  }
  return toNodesAndEdges(records);

};

module.exports = Cymine;
