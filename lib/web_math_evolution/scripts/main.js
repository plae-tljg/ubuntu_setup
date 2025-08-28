document.addEventListener('DOMContentLoaded', () => {
    // DOM元素引用
    const solveButton = document.getElementById('solve-button');
    const stopButton = document.getElementById('stop-button');
    const targetNumberInput = document.getElementById('target-number');
    const availableNumbersInput = document.getElementById('available-numbers');
    const operationCheckboxes = document.querySelectorAll('.operation');
    const populationSizeInput = document.getElementById('population-size');
    const generationsInput = document.getElementById('generations');
    const mutationRateInput = document.getElementById('mutation-rate');
    const mutationRateValue = document.getElementById('mutation-rate-value');
    const solutionContainer = document.getElementById('solution-container');
    const visualizationContainer = document.getElementById('visualization-container');
    const generationGrid = document.getElementById('generation-grid');
    const prevGenButton = document.getElementById('prev-gen');
    const nextGenButton = document.getElementById('next-gen');
    const currentGenDisplay = document.getElementById('current-gen-display');
    
    // 统计数据元素
    const currentGenerationElement = document.getElementById('current-generation');
    const bestFitnessElement = document.getElementById('best-fitness');
    const currentBestElement = document.getElementById('current-best');
    const targetDistanceElement = document.getElementById('target-distance');
    const computationTimeElement = document.getElementById('computation-time');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    
    // 初始化可视化计算器
    const visualCalculator = new VisualCalculator(visualizationContainer);
    
    // 初始化进化算法求解器
    let evolutionSolver;
    
    // 存储每代的种群数据
    let populationHistory = [];
    let currentDisplayedGeneration = 0;
    let isRunning = false;
    let startTime;
    
    // 进化历史图表
    let evolutionChart;
    
    // 初始化Chart.js
    function initChart() {
        const ctx = document.getElementById('evolution-chart').getContext('2d');
        
        evolutionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '最佳适应度',
                    data: [],
                    borderColor: '#3a7bd5',
                    backgroundColor: 'rgba(58, 123, 213, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: '平均适应度',
                    data: [],
                    borderColor: '#00d2ff',
                    backgroundColor: 'rgba(0, 210, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 300
                }
            }
        });
    }
    
    // 初始化图表
    initChart();
    
    // 监听变异率滑动条变化
    mutationRateInput.addEventListener('input', () => {
        mutationRateValue.textContent = mutationRateInput.value;
    });
    
    // 更新种群图形化展示
    function updateGenerationGrid(generation) {
        if (!populationHistory.length || !populationHistory[generation]) {
            generationGrid.innerHTML = '<div class="empty-message">没有数据可显示</div>';
            return;
        }
        
        generationGrid.innerHTML = '';
        const population = populationHistory[generation];
        
        // 找出最佳个体
        const bestFitness = Math.min(...population.map(ind => ind.fitness));
        
        // 为每个个体创建卡片（限制显示数量，避免过多渲染）
        const displayCount = Math.min(population.length, 24); // 显示前24个个体
        
        for (let i = 0; i < displayCount; i++) {
            const individual = population[i];
            const card = document.createElement('div');
            card.className = 'individual-card';
            if (individual.fitness === bestFitness) {
                card.classList.add('best');
            }
            
            const fitness = document.createElement('div');
            fitness.className = 'individual-fitness';
            fitness.textContent = `适应度: ${individual.fitness.toFixed(2)}`;
            
            const expression = document.createElement('div');
            expression.className = 'individual-expression';
            expression.textContent = evolutionSolver.prettyExpression(individual.chromosomes);
            
            const value = document.createElement('div');
            value.className = 'individual-value';
            value.textContent = `= ${individual.value}`;
            
            const visualization = document.createElement('div');
            visualization.className = 'individual-visualization';
            
            card.appendChild(fitness);
            card.appendChild(expression);
            card.appendChild(value);
            card.appendChild(visualization);
            generationGrid.appendChild(card);
            
            // 为所有显示的个体添加简化的可视化
            const miniVisualCalculator = new VisualCalculator(visualization);
            miniVisualCalculator.visualizeExpression(
                evolutionSolver.expressionToString(individual.chromosomes),
                true // 小型模式
            );
        }
        
        // 如果还有更多个体但没有显示，添加提示信息
        if (displayCount < population.length) {
            const moreInfo = document.createElement('div');
            moreInfo.className = 'more-individuals';
            moreInfo.textContent = `还有 ${population.length - displayCount} 个个体未显示`;
            generationGrid.appendChild(moreInfo);
        }
        
        // 更新当前代数显示
        currentGenDisplay.textContent = `当前代: ${generation + 1}`;
        
        // 更新上一代/下一代按钮状态
        prevGenButton.disabled = generation === 0;
        nextGenButton.disabled = generation === populationHistory.length - 1;
    }
    
    // 上一代按钮点击事件
    prevGenButton.addEventListener('click', () => {
        if (currentDisplayedGeneration > 0) {
            currentDisplayedGeneration--;
            updateGenerationGrid(currentDisplayedGeneration);
        }
    });
    
    // 下一代按钮点击事件
    nextGenButton.addEventListener('click', () => {
        if (currentDisplayedGeneration < populationHistory.length - 1) {
            currentDisplayedGeneration++;
            updateGenerationGrid(currentDisplayedGeneration);
        }
    });
    
    // 停止按钮点击事件
    stopButton.addEventListener('click', () => {
        isRunning = false;
        stopButton.disabled = true;
        solveButton.disabled = false;
    });
    
    // 开始求解按钮点击事件
    solveButton.addEventListener('click', () => {
        if (isRunning) return;
        
        // 获取输入值
        const targetNumber = parseInt(targetNumberInput.value);
        const availableNumbers = availableNumbersInput.value
            .split(',')
            .map(num => num.trim())
            .filter(num => num !== '')
            .map(num => parseInt(num));
        
        // 获取选中的操作
        const selectedOperations = Array.from(operationCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        // 获取算法参数
        const populationSize = parseInt(populationSizeInput.value);
        const generations = parseInt(generationsInput.value);
        const mutationRate = parseFloat(mutationRateInput.value);
        
        // 验证输入
        if (isNaN(targetNumber) || availableNumbers.some(isNaN)) {
            solutionContainer.innerHTML = '<p class="error">请输入有效的目标数值和可用数字</p>';
            return;
        }
        
        // 初始化状态
        isRunning = true;
        solveButton.disabled = true;
        stopButton.disabled = false;
        populationHistory = [];
        currentDisplayedGeneration = 0;
        startTime = performance.now();
        
        // 重置图表
        evolutionChart.data.labels = [];
        evolutionChart.data.datasets[0].data = [];
        evolutionChart.data.datasets[1].data = [];
        evolutionChart.update();
        
        // 清空之前的结果
        solutionContainer.innerHTML = '<p>计算中...</p>';
        visualizationContainer.innerHTML = '';
        generationGrid.innerHTML = '<div class="empty-message">进化算法正在运行...</div>';
        
        // 初始化进化算法求解器
        evolutionSolver = new EvolutionSolver({
            populationSize,
            generations,
            mutationRate,
            elitism: 0.1,
            tournamentSize: 3,
            // 每代回调
            generationCallback: async (generation, population, stats) => {
                // 更新统计数据
                currentGenerationElement.textContent = generation + 1;
                bestFitnessElement.textContent = stats.bestFitness.toFixed(2);
                currentBestElement.textContent = evolutionSolver.prettyExpression(stats.bestIndividual.chromosomes);
                targetDistanceElement.textContent = Math.abs(targetNumber - stats.bestIndividual.value).toFixed(2);
                
                // 更新计算时间
                const currentTime = performance.now();
                computationTimeElement.textContent = ((currentTime - startTime) / 1000).toFixed(2);
                
                // 更新进度条
                const progress = ((generation + 1) / generations) * 100;
                progressBar.style.width = `${progress}%`;
                progressPercent.textContent = `${Math.round(progress)}%`;
                
                // 保存种群数据
                populationHistory.push([...population]);
                currentDisplayedGeneration = generation;
                
                // 更新种群图形化展示
                updateGenerationGrid(currentDisplayedGeneration);
                
                // 更新图表
                evolutionChart.data.labels.push(generation + 1);
                evolutionChart.data.datasets[0].data.push(stats.bestFitness);
                evolutionChart.data.datasets[1].data.push(stats.averageFitness);
                evolutionChart.update();
                
                // 让UI有时间更新
                await new Promise(resolve => setTimeout(resolve, 10));
                
                // 返回是否继续
                return isRunning;
            }
        });
        
        // 启动进化算法求解
        evolutionSolver.solve(targetNumber, availableNumbers, selectedOperations)
            .then(solution => {
                isRunning = false;
                solveButton.disabled = false;
                stopButton.disabled = true;
                
                if (solution) {
                    // 更新最终结果
                    solutionContainer.innerHTML = `
                        <div class="solution-success">
                            <h3>找到解决方案!</h3>
                            <p class="solution-expression">${solution.prettyExpression} = ${solution.value}</p>
                            <p class="solution-detail">使用了 ${populationHistory.length} 代进化求解</p>
                        </div>
                    `;
                    
                    // 可视化最终解决方案
                    visualCalculator.visualizeExpression(solution.expression);
                } else {
                    solutionContainer.innerHTML = `
                        <div class="solution-failure">
                            <h3>未找到精确解决方案</h3>
                            <p>最接近的表达式: ${evolutionSolver.prettyExpression(populationHistory[populationHistory.length-1][0].chromosomes)} = ${populationHistory[populationHistory.length-1][0].value}</p>
                            <p>与目标 ${targetNumber} 的差距: ${Math.abs(targetNumber - populationHistory[populationHistory.length-1][0].value).toFixed(2)}</p>
                            <p>请尝试不同的数字、操作或增加种群大小和代数。</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                isRunning = false;
                solveButton.disabled = false;
                stopButton.disabled = true;
                solutionContainer.innerHTML = `<p class="error">计算过程中出错: ${error.message}</p>`;
                console.error('进化算法错误:', error);
            });
    });
    
    // 添加示例按钮 - 让用户可以快速尝试预设的例子
    const exampleButton = document.createElement('button');
    exampleButton.id = 'example-button';
    exampleButton.innerHTML = '<i class="fas fa-lightbulb"></i> 加载示例';
    exampleButton.style.marginTop = '0.5rem';
    exampleButton.style.background = '#f39c12';
    
    exampleButton.addEventListener('click', () => {
        targetNumberInput.value = '800';
        availableNumbersInput.value = '1,1,4,5,1,4';
        
        // 确保所有操作被选中
        operationCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // 设置一些合理的算法参数
        populationSizeInput.value = '300';
        generationsInput.value = '100';
        mutationRateInput.value = '0.3';
        mutationRateValue.textContent = '0.3';
    });
    
    // 将示例按钮添加到界面
    solveButton.parentNode.insertBefore(exampleButton, stopButton);
    
    // 添加使用教程按钮
    const helpButton = document.createElement('button');
    helpButton.id = 'help-button';
    helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpButton.style.position = 'fixed';
    helpButton.style.bottom = '20px';
    helpButton.style.right = '20px';
    helpButton.style.width = '50px';
    helpButton.style.height = '50px';
    helpButton.style.borderRadius = '50%';
    helpButton.style.fontSize = '1.5rem';
    
    helpButton.addEventListener('click', () => {
        const helpDialog = document.createElement('div');
        helpDialog.className = 'help-dialog';
        
        helpDialog.innerHTML = `
            <div class="help-content">
                <h2><i class="fas fa-question-circle"></i> 如何使用智能符号操作求解器</h2>
                <ol>
                    <li>输入目标数值，例如 800</li>
                    <li>输入可用数字列表，以逗号分隔，例如 1,1,4,5,1,4</li>
                    <li>选择允许使用的运算符</li>
                    <li>调整算法参数（可选）</li>
                    <li>点击"开始求解"按钮开始计算</li>
                </ol>
                <p>系统将尝试通过进化算法找到一个表达式，使用给定的数字和运算符组合得到目标数值。</p>
                <p>您可以在种群可视化区域看到每一代中各个表达式的演化过程!</p>
                <button id="close-help">明白了</button>
            </div>
        `;
        
        document.body.appendChild(helpDialog);
        
        document.getElementById('close-help').addEventListener('click', () => {
            document.body.removeChild(helpDialog);
        });
    });
    
    document.body.appendChild(helpButton);
    
    // 添加额外的CSS样式
    const extraStyles = document.createElement('style');
    extraStyles.textContent = `
        .visual-box.mini {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
        }
        
        .operation-text.mini {
            font-size: 0.9rem;
            margin: 0 0.2rem;
        }
        
        .result-box.mini, .error-box.mini {
            padding: 0.2rem 0.5rem;
            font-size: 0.9rem;
        }
        
        .more-individuals {
            grid-column: 1 / -1;
            text-align: center;
            padding: 1rem;
            color: #777;
            font-style: italic;
        }
        
        .solution-success {
            padding: 1rem;
            background-color: rgba(46, 204, 113, 0.1);
            border-left: 4px solid #2ecc71;
            border-radius: 4px;
        }
        
        .solution-failure {
            padding: 1rem;
            background-color: rgba(243, 156, 18, 0.1);
            border-left: 4px solid #f39c12;
            border-radius: 4px;
        }
        
        .solution-expression {
            font-weight: bold;
            margin: 0.5rem 0;
            font-size: 1.2rem;
        }
        
        .solution-detail {
            color: #777;
        }
        
        .help-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .help-content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .help-content h2 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .help-content ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        
        .help-content li {
            margin-bottom: 0.5rem;
        }
        
        #close-help {
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
        }
        
        .error {
            color: #e74c3c;
            font-weight: bold;
        }
    `;
    
    document.head.appendChild(extraStyles);
});
