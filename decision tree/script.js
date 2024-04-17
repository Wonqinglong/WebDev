document.getElementById('upload-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
      alert('请选择一个CSV文件');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(event) {
      const csvString = event.target.result;
      const { headers, data } = parseCSV(csvString);
      const decisionTree = buildDecisionTree(data, '结果', headers.slice(0, -1));
      displayTree(decisionTree, document.getElementById('tree-container'));
    };
    reader.readAsText(file);
  });
  
  // Parse CSV string into data array （解析CSV字符串为数据数组）
  function parseCSV(csvString) {
      const lines = csvString.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      const data = [];
  
      for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(value => parseFloat(value.trim()));
          const row = {};
          for (let j = 0; j < headers.length; j++) {
              row[headers[j]] = values[j];
          }
          data.push(row);
      }
  
      return { headers, data };
  }
  
  // Decision tree node class  （决策树节点类）
  class TreeNode {
      constructor(attribute, branches, result) {
          this.attribute = attribute; //  Split  分裂属性
          this.branches = branches; // child node  子节点
          this.result = result; // Leaf node results  叶节点的结果
      }
  }
  
  // Calculate the entropy of a data set    计算数据集的熵
  function calculateEntropy(data) {
      const counts = {};
      for (const row of data) {
          const result = row['结果'];
          counts[result] = (counts[result] || 0) + 1;
      }
      const totalCount = data.length;
      let entropy = 0;
      for (const count of Object.values(counts)) {
          const probability = count / totalCount;
          entropy -= probability * Math.log2(probability);
      }
      return entropy;
  }
  
  // Select the best splitting attributes from the data set    从数据集中选择最佳分裂属性
  function chooseBestAttribute(data, attributes) {
      let bestAttribute = null;
      let bestInfoGain = -Infinity;
      const baseEntropy = calculateEntropy(data);
      for (const attribute of attributes) {
          const attributeValues = new Set(data.map(row => row[attribute]));
          let newEntropy = 0;
          for (const value of attributeValues) {
              const subset = data.filter(row => row[attribute] === value);
              const probability = subset.length / data.length;
              newEntropy += probability * calculateEntropy(subset);
          }
          const infoGain = baseEntropy - newEntropy;
          if (infoGain > bestInfoGain) {
              bestInfoGain = infoGain;
              bestAttribute = attribute;
          }
      }
      return bestAttribute;
  }
  
  // Build decision tree    构建决策树
  function buildDecisionTree(data, targetAttribute, attributes) {
      if (data.length === 0) {
          return null;
      }
      const uniqueResults = [...new Set(data.map(row => row[targetAttribute]))];
      if (uniqueResults.length === 1) {
          return new TreeNode(null, null, uniqueResults[0]);
      }
      if (attributes.length === 0) {
          const majorityResult = getMajorityResult(data, targetAttribute);
          return new TreeNode(null, null, majorityResult);
      }
      const bestAttribute = chooseBestAttribute(data, attributes);
      const remainingAttributes = attributes.filter(attr => attr !== bestAttribute);
      const branches = {};
      const attributeValues = new Set(data.map(row => row[bestAttribute]));
      for (const value of attributeValues) {
          const subset = data.filter(row => row[bestAttribute] === value);
          branches[value] = buildDecisionTree(subset, targetAttribute, remainingAttributes);
      }
      return new TreeNode(bestAttribute, branches, null);
  }
  
  // Get the main results in the dataset     获取数据集中的主要结果
  function getMajorityResult(data, targetAttribute) {
      const counts = {};
      for (const row of data) {
          const result = row[targetAttribute];
          counts[result] = (counts[result] || 0) + 1;
      }
      let maxCount = -Infinity;
      let majorityResult = null;
      for (const [result, count] of Object.entries(counts)) {
          if (count > maxCount) {
              maxCount = count;
              majorityResult = result;
          }
      }
      return majorityResult;
  }
  
  
  // Decision tree visualization logic (animation effect)    决策树可视化逻辑（动画效果）
  function displayTree(decisionTree, container, indent = 0) {
      let delay = 0;
      if (decisionTree.result !== null) {
          addNode('结果: ' + decisionTree.result, indent * 10, delay, container);
      } else {
          addNode('属性: ' + decisionTree.attribute, indent * 10, delay, container);
          delay += 500; // Increase the delay time to animate the node   增加延迟时间，使得节点以动画形式显示
          for (const [value, branch] of Object.entries(decisionTree.branches)) {
              addNode('值: ' + value, indent * 10 + 20, delay, container);
              delay += 500; // Increase the delay time to animate the node   增加延迟时间，使得节点以动画形式显示
              displayTree(branch, container, indent + 1);
          }
      }
  }
  
  // Add nodes to the page and display them in animation     在页面上添加节点，并以动画形式显示
  function addNode(text, marginLeft, delay, container) {
      setTimeout(function() {
          const node = document.createElement('div');
          node.textContent = text;
          node.style.marginLeft = marginLeft + 'px';
          node.classList.add('node');
          container.appendChild(node);
          setTimeout(function() {
              node.classList.add('show');
          }, 100); // Delay display nodes by 100 milliseconds for animation effects    延迟100毫秒显示节点，以实现动画效果
      }, delay);
  }