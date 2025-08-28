class VisualCalculator {
    constructor(container) {
        this.container = container;
        this.boxColors = [
            '#3498db', // 蓝色
            '#2ecc71', // 绿色
            '#e74c3c', // 红色
            '#f39c12', // 橙色
            '#9b59b6', // 紫色
            '#1abc9c'  // 青绿色
        ];
    }
    
    // 可视化数字
    visualizeNumber(number, color, isMini = false) {
        // 为每个数字创建一个盒子
        const box = document.createElement('div');
        box.className = 'visual-box';
        if (isMini) box.classList.add('mini');
        box.textContent = number;
        box.style.backgroundColor = color || this.getRandomColor();
        
        return box;
    }
    
    // 可视化表达式
    visualizeExpression(expression, isMini = false) {
        // 清空容器
        this.container.innerHTML = '';
        
        // 解析表达式
        const tokens = expression.split(' ');
        let currentValue = 0;
        let currentOperation = '+';
        let resultElement;
        
        // 为表达式创建可视化元素
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            // 判断是操作符还是数字
            if (['+', '-', '*', '/', '^', '%', 'concat'].includes(token)) {
                currentOperation = token;
                
                // 添加操作符文本
                const opText = document.createElement('div');
                opText.className = 'operation-text';
                if (isMini) opText.classList.add('mini');
                opText.textContent = token === 'concat' ? '⊕' : token;
                this.container.appendChild(opText);
            } else {
                // 是数字
                const number = parseInt(token);
                
                // 在迷你模式下，只显示数字，不展开可视化
                if (isMini) {
                    this.container.appendChild(this.visualizeNumber(number, this.getRandomColor(), true));
                    continue;
                }
                
                // 根据操作符执行相应的可视化
                switch (currentOperation) {
                    case '+':
                        // 添加相应数量的盒子
                        for (let j = 0; j < number; j++) {
                            this.container.appendChild(this.visualizeNumber(1, this.getRandomColor()));
                        }
                        currentValue += number;
                        break;
                    case '-':
                        // 添加要移除的盒子（使用不同颜色）
                        for (let j = 0; j < number; j++) {
                            const box = this.visualizeNumber(1, '#e74c3c');
                            box.style.textDecoration = 'line-through';
                            this.container.appendChild(box);
                        }
                        currentValue -= number;
                        break;
                    case '*':
                        // 乘法可视化
                        const multiplicationGroup = document.createElement('div');
                        multiplicationGroup.className = 'operation-group';
                        multiplicationGroup.textContent = `×${number}`;
                        this.container.appendChild(multiplicationGroup);
                        currentValue *= number;
                        break;
                    default:
                        // 其他操作简单显示数字
                        this.container.appendChild(this.visualizeNumber(number, this.getRandomColor()));
                        break;
                }
            }
        }
        
        // 添加等号和结果
        const equalsText = document.createElement('div');
        equalsText.className = 'operation-text';
        if (isMini) equalsText.classList.add('mini');
        equalsText.textContent = '=';
        this.container.appendChild(equalsText);
        
        // 计算表达式的最终结果
        try {
            // 安全计算结果
            const result = this.safeEval(expression);
            resultElement = document.createElement('div');
            resultElement.className = 'result-box';
            if (isMini) resultElement.classList.add('mini');
            resultElement.textContent = result;
            this.container.appendChild(resultElement);
            
            // 返回计算结果，可用于后续处理
            return result;
        } catch (e) {
            // 处理无效表达式
            resultElement = document.createElement('div');
            resultElement.className = 'error-box';
            if (isMini) resultElement.classList.add('mini');
            resultElement.textContent = '错误';
            this.container.appendChild(resultElement);
            return null;
        }
    }
    
    // 安全计算表达式（不使用eval）
    safeEval(expression) {
        // 将表达式拆分为标记
        const tokens = expression.split(' ').filter(token => token.trim() !== '');
        
        // 处理连接操作
        const processedTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === 'concat' && i > 0 && i < tokens.length - 1) {
                // 连接前后的数字
                const concatResult = `${tokens[i-1]}${tokens[i+1]}`;
                processedTokens.pop(); // 移除前一个数字
                processedTokens.push(concatResult); // 添加连接结果
                i++; // 跳过下一个数字
            } else {
                processedTokens.push(tokens[i]);
            }
        }
        
        // 使用自定义函数计算表达式
        return this.calculateExpression(processedTokens);
    }
    
    // 计算表达式
    calculateExpression(tokens) {
        if (tokens.length === 0) return 0;
        if (tokens.length === 1) return parseInt(tokens[0]);
        
        let result = parseInt(tokens[0]);
        
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const operand = parseInt(tokens[i+1]);
            
            switch (operator) {
                case '+':
                    result += operand;
                    break;
                case '-':
                    result -= operand;
                    break;
                case '*':
                    result *= operand;
                    break;
                case '/':
                    if (operand === 0) throw new Error("除以零");
                    result /= operand;
                    break;
                case '^':
                    result = Math.pow(result, operand);
                    break;
                case '%':
                    if (operand === 0) throw new Error("模零");
                    result = result % operand;
                    break;
                default:
                    throw new Error("未知操作符");
            }
        }
        
        return result;
    }
    
    // 获取随机颜色
    getRandomColor() {
        return this.boxColors[Math.floor(Math.random() * this.boxColors.length)];
    }
} 