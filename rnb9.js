
  function preview4rnb9(){  
    var head = "import React from 'react';\n" +
              "import { Button, View, Text } from 'react-native';\n" +
              "import { createAppContainer, createStackNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createBottomTabNavigator  } from 'react-navigation';\n\n";

    var AppContainer = "const AppContainer = createAppContainer(RootStack);\n\n" +
            "export default class App extends React.Component {\n" +
            "  render() {\n" +
            "    return <AppContainer />;\n" +
            "  }\n" +
            "}\n";

    var screenStr = "";
    var stackStr = "";
    function getClasses(node, parentNode) {
      if (!node) return;

      var childStr = "";
      var children = node.children;

      if (children) {
          for (var i = 0; i < children.length; i++) {
            childStr += getClasses(children[i], node);
          }
      }

      var className = "";

      switch(node.nodeType) {
        case "S": screenStr += makeScreen(node.name, makeButton4Child(node, parentNode));
                  className = "    " + node.name + ": " + node.name + "Screen,\n";
                  break;
        default: stackStr += makeStackNavigation(node, childStr); 
                  className = "    " + node.name + ": " + node.name + "Stack,\n";
                  break;
      } 

      return className;
    }

    getClasses(dndTree.getRoot());

    return head + screenStr + stackStr + AppContainer.replace("RootStack", dndTree.getRoot().name+"Stack");
  }

  function makeScreen(classname, buttons){ 
    var screen = "\nclass " + classname + "Screen extends React.Component {\n" +
        "  render() {\n" +
        "    return (\n" +
        "      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>\n" +
        "        <Text>" + classname + " Screen</Text>\n" + buttons +
        "      </View>\n" +
        "    );\n" +
        "  }\n" +
        "}\n\n";
    return screen;
  }

  function makeStackNavigation(node, childStr){
    var stack = "const " + node.name + "Stack = create" + node.nodeType + "Navigator({\n" + 
        "   " + childStr + "\n" + 
        "   }, {\n" +
        "      initialRouteName: '" + getFirstChildName(node.children) +"',\n" +
        "  })\n";
    return stack;
  }

  function makeButton4Child(node, parentNode){
    if (!parentNode.children) return "";

    var buttons = "";
    var children = parentNode.children;

    if (parentNode.nodeType==="Drawer") {
      buttons = "        <Button title='Show Drawer' onPress={() => this.props.navigation.toggleDrawer()}/>\n" ;

    } else 
    if (parentNode.nodeType==="Stack") {
      for (var i = 0; i < children.length; i++) {
        if (node===children[i]) continue;
        buttons += "        <Button title='Go to " + children[i].name + "' onPress={() => this.props.navigation.navigate('" + children[i].name + "')}/>\n" ;
      }
    }
    return buttons;
  }

  function getFirstChildName(children) {
    if (!children) return;

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType==="Drawer") return children[i].name;
    }
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType==="BottomTab" || children[i].nodeType==="Tab") return children[i].name;
    }

    return children[0].name;
  }  
