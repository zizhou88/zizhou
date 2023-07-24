let currentNodeKey = null;
let topDiagram;
let bottomDiagram;

document.addEventListener('DOMContentLoaded', function() {
// 创建新策略部分
let newp = document.getElementById('newp');
let createStrategy = document.getElementById('createStrategy');
let strategyNameInput = document.getElementById('strategyName');
let createButton = document.getElementById('createButton');
let strategyList = document.getElementById('strategyList');
let $ = go.GraphObject.make;



// 注册按钮点击事件
createButton.addEventListener('click', () => {

  // 获取策略名称
  const strategyName = strategyNameInput.value;

  // 调用后端API注册策略
  fetch( 'http://127.0.0.1:5000/register', {
    method: 'POST',
    body: JSON.stringify({
      strategy_name: strategyName
    })
  })
  .then(res => res.json())
  .then(data => {
    // 显示成功提示
    alert(data.message);
  });

});

const generateButton = document.getElementById('generateButton');

generateButton.addEventListener('click', () => {
  // generate logic here 
});

 topDiagram = $(go.Diagram, "topDiagramDiv",  // must name or refer to the DIV HTML element
  {
    initialContentAlignment: go.Spot.Center,  // center the content
    "undoManager.isEnabled": true,  // enable Ctrl-Z to undo and Ctrl-Y to redo
    allowVerticalScroll: false,  // disable vertical scroll
    allowHorizontalScroll: false  // disable horizontal scroll

  });

 bottomDiagram = $(go.Diagram, "bottomDiagramDiv",  // must name or refer to the DIV HTML element
  {
    initialContentAlignment: go.Spot.Center,  // center the content
    "undoManager.isEnabled": true,  // enable Ctrl-Z to undo and Ctrl-Y to redo
    allowVerticalScroll: false,  // disable vertical scroll
    allowHorizontalScroll: false  // disable horizontal scroll

  });

newp.onclick = function() {
    createStrategy.style.display = "block";
};


createButton.onclick = function() {
    createStrategy.style.display = "none";
    let newStrategy = document.createElement('div');
    newStrategy.classList.add('strategy-item');
    let newStrategyIcon = document.createElement('img');
    newStrategyIcon.src = 'celue.jpg';
    newStrategyIcon.alt = strategyNameInput.value;
    newStrategyIcon.classList.add('strategy-icon');
    let newStrategyName = document.createElement('span');
    newStrategyName.textContent = strategyNameInput.value;
    newStrategy.appendChild(newStrategyIcon);
    newStrategy.appendChild(newStrategyName);
    strategyList.appendChild(newStrategy);
};

//连接线部分开始
// 创建连接线的模板
topDiagram.linkTemplate =
  $(go.Link,
    { routing: go.Link.AvoidsNodes, corner: 5 },
    $(go.Shape, { strokeWidth: 2, stroke: "black" })
  );

bottomDiagram.linkTemplate =
  $(go.Link,
    { routing: go.Link.AvoidsNodes, corner: 5 },
    $(go.Shape, { strokeWidth: 2, stroke: "black" })
  );

// 用于跟踪第一个和第二个节点的变量
var firstNode = null;
var secondNode = null;

// 鼠标点击事件处理程序
topDiagram.addDiagramListener("ObjectSingleClicked", function(e) {
  var clickedPart = e.subject.part;
  if (clickedPart instanceof go.Node) {
    if (firstNode === null) {
      // 第一次点击节点，记录为第一个节点
      firstNode = clickedPart;
    } else if (secondNode === null) {
      // 第二次点击节点，记录为第二个节点
      secondNode = clickedPart;

      // 创建连线
      if (firstNode.data.key !== null && secondNode.data.key !== null) {
        // 创建连线
        topDiagram.model.addLinkData({ from: firstNode.data.key, to: secondNode.data.key });
      }

      // 重置节点变量
      firstNode = null;
      secondNode = null;
    }
  }
});

bottomDiagram.addDiagramListener("ObjectSingleClicked", function(e) {
  var clickedPart = e.subject.part;
  if (clickedPart instanceof go.Node) {
    if (firstNode === null) {
      // 第一次点击节点，记录为第一个节点
      firstNode = clickedPart;
    } else if (secondNode === null) {
      // 第二次点击节点，记录为第二个节点
      secondNode = clickedPart;

      if (firstNode.data.key !== null && secondNode.data.key !== null) {
        // 创建连线
        bottomDiagram.model.addLinkData({ from: firstNode.data.key, to: secondNode.data.key });
      }
      // 重置节点变量
      firstNode = null;
      secondNode = null;
    }
  }
});
//连接线部分结束
//节点部分开始
// 定义节点模板
topDiagram.nodeTemplate =
  $(go.Node, "Auto",  
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { minSize: new go.Size(200, 50) },
    $(go.Shape, "Rectangle",
      { 
        width: 200, 
        height: 50, 
        strokeWidth: 2 
      },
      new go.Binding("fill", "color")),
    $(go.Panel, "Vertical",
      { defaultAlignment: go.Spot.Center },
      $(go.TextBlock,
        { margin: new go.Margin(10, 0, 0, 10) },
        new go.Binding("text", "key")),
      $(go.TextBlock,
        { margin: new go.Margin(10, 0, 0, 10) },
        new go.Binding("text", "sub"))
    )
  );

bottomDiagram.nodeTemplate =
  $(go.Node, "Auto",  
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { minSize: new go.Size(200, 50) },
    $(go.Shape, "Rectangle",
      { 
        width: 200, 
        height: 50, 
        strokeWidth: 2 
      },
      new go.Binding("fill", "color")),
    $(go.Panel, "Vertical",
      { defaultAlignment: go.Spot.Center },
      $(go.TextBlock,
        { margin: new go.Margin(10, 0, 0, 10) },
        new go.Binding("text", "key")),
      $(go.TextBlock,
        { margin: new go.Margin(10, 0, 0, 10) },
        new go.Binding("text", "sub"))
    )
  );

// 添加五个固定的节点
topDiagram.model = new go.GraphLinksModel(
  [
    { key: "Target stock", color: "transparent", loc: "0 0" },
    { key: "Buying standard", color: "transparent", loc: "-200 150" },
    { key: "Hold stocks", color: "transparent", loc: "0 300" },
  ]
);

bottomDiagram.model = new go.GraphLinksModel(
  [
    { key: "Hold stocks", color: "transparent", loc: "0 0" },
    { key: "Selling standard", color: "transparent", loc: "-200 150" },
    { key: "liquidate", color: "transparent", loc: "0 300" },
  ]
);
//节点部分结束

//买入条件部分的事件监听机器
document.getElementById('purchase-button').addEventListener('click', function() {
  for (let i = 1; i <= 2; i++) {
      let dropdown = document.querySelector('.dropdown-' + i);
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }
});

//卖出条件部分的事件监听机器
document.getElementById('sale-button').addEventListener('click', function() {
  for (let i = 3; i <= 4; i++) {
      let dropdown = document.querySelector('.dropdown-' + i);
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }
});

// 获取所有的下拉栏
var dropdownHeaders = document.querySelectorAll('.dropbtn');

// 为每一个下拉栏添加事件监听器
dropdownHeaders.forEach(function(header) {
  header.addEventListener('click', function() {
    // 获取下一个同级元素（即下拉内容）
    var content = this.nextElementSibling;
    // 如果下拉内容是可见的，就隐藏它
    if (content.style.display === 'block') {
      content.style.display = 'none';
    }
    // 否则就显示它
    else {
      content.style.display = 'block';
    }
  });
});

// 获取所有的选项
var optionsa = document.getElementsByClassName('option');

// 为每个选项添加事件监听器
for (let i = 0; i < optionsa.length; i++) {
  optionsa[i].addEventListener('click', function() {
    // 获取选项的文本内容作为节点的名称
    var optionText = this.textContent;
    

    // 添加节点到流程图中
    topDiagram.model.addNodeData({ key: optionText, color: "transparent" });
    if (optionText === 'MA') {
      let maSubOptions = document.getElementById('sub-option-magoldfork');
      if (maSubOptions) {
        maSubOptions.style.display = maSubOptions.style.display === 'none' ? 'block' : 'none';

        // 切换子选项的文本内容
        let maSubOptionElements = maSubOptions.getElementsByClassName('sub-option');
        for (let j = 0; j < maSubOptionElements.length; j++) {
          let maSubOptionElement = maSubOptionElements[j];

          // 将optionText保存为自定义属性
          maSubOptionElement.optionText = optionText;

          maSubOptionElement.addEventListener('click', function(event) {
            event.preventDefault();

            // 修改当前节点的文本内容
            let node = topDiagram.findNodeForKey(optionText);
            if (node) {
              let subOptionText = maSubOptionElement.textContent;
              let nodeText = optionText + '\n' + subOptionText;
              topDiagram.model.setDataProperty(node.data, "text", nodeText);
            }
          });
        }
      }
    }
  });
}

var options = document.getElementsByClassName('option');
for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    // 获取选项的文本内容作为节点的名称
    var optionText = this.textContent;
    
    // 添加节点到流程图中
    bottomDiagram.model.addNodeData({ key: optionText, color: "transparent" });

    if (optionText === 'MA') {
      let maSubOptions = document.getElementById('sub-option-magoldfork');
      if (maSubOptions) {
        maSubOptions.style.display = maSubOptions.style.display === 'none' ? 'block' : 'none';

        // 切换子选项的文本内容
        let maSubOptionElements = maSubOptions.getElementsByClassName('sub-option');
        for (let j = 0; j < maSubOptionElements.length; j++) {
          let maSubOptionElement = maSubOptionElements[j];

          // 将optionText保存为自定义属性
          maSubOptionElement.optionText = optionText;

          maSubOptionElement.addEventListener('click', function(event) {
            event.preventDefault();

            // 修改当前节点的文本内容
            let node = bottomDiagram.findNodeForKey(optionText);
            if (node) {
              let subOptionText = maSubOptionElement.textContent;
              let nodeText = optionText + '\n' + subOptionText;
              bottomDiagram.model.setDataProperty(node.data, "text", nodeText);
            }
          });
        }
      }
    }
  });
}






// 为点击MA后的选项添加点击事件//跟下拉栏的是否能够弹出有关
let strategyOptions = document.getElementsByClassName('option');

for (let i = 0; i < strategyOptions.length; i++) {
  strategyOptions[i].addEventListener('click', function(event) {
    event.preventDefault();
    let subOptions = this.nextElementSibling;
    subOptions.style.display = subOptions.style.display === 'none' ? 'block' : 'none';

    // 切换子选项的文本内容
    let subOptionElements1 = subOptions.getElementsByClassName('sub-option1');
    let subOptionElements2 = subOptions.getElementsByClassName('sub-option2');

    for (let j = 0; j < subOptionElements1.length; j++) {
      let subOptionElement = subOptionElements1[j];
      let optionText = this.textContent;

      subOptionElement.addEventListener('click', function(event) {
        event.preventDefault();

        // 修改当前节点的文本内容（位于topDiagram）
        let node = topDiagram.findNodeForKey(optionText);
        if (node) {
          let subOptionText = subOptionElement.textContent;
          let nodeText = optionText + '\n' + subOptionText;
          topDiagram.model.setDataProperty(node.data, "key", nodeText);
        }
      });
    }

    for (let j = 0; j < subOptionElements2.length; j++) {
      let subOptionElement = subOptionElements2[j];
      let optionText = this.textContent;

      subOptionElement.addEventListener('click', function(event) {
        event.preventDefault();

        // 修改当前节点的文本内容（位于bottomDiagram）
        let node = bottomDiagram.findNodeForKey(optionText);
        if (node) {
          let subOptionText = subOptionElement.textContent;
          let nodeText = optionText + '\n' + subOptionText;
          bottomDiagram.model.setDataProperty(node.data, "key", nodeText);
        }
      });
    }
  });
}



})
