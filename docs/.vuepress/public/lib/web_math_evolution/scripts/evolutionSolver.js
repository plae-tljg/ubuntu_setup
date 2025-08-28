class EvolutionSolver {
    constructor(options = {}) {
        // 初始化算法参数
        this.populationSize = options.populationSize || 200;
        this.generations = options.generations || 100;
        this.mutationRate = options.mutationRate || 0.2;
        this.elitism = options.elitism || 0.1; // 保留最佳个体的比例
        this.tournamentSize = options.tournamentSize || 3; // 锦标赛选择规模
        
        // 注册代际回调函数
        this.generationCallback = options.generationCallback || null;
        
        // 获取UI元素引用
        this.progressBar = document.getElementById('progress-bar');
        this.evolutionStats = document.getElementById('evolution-stats');
        this.bestSolutionsContainer = document.getElementById('evolution-best-solutions');
    }
    
    // 异步求解方法
    async solve(targetNumber, availableNumbers, allowedOperations) {
        this.targetNumber = targetNumber;
        this.availableNumbers = availableNumbers;
        this.allowedOperations = allowedOperations;
        
        // 初始化种群
        let population = this.initializePopulation();
        let bestSolution = null;
        
        // 清空之前的状态
        if (this.bestSolutionsContainer) {
            this.bestSolutionsContainer.innerHTML = '';
        }
        if (this.evolutionStats) {
            this.evolutionStats.innerHTML = '开始进化算法...';
        }
        
        // 进化过程
        for (let generation = 0; generation < this.generations; generation++) {
            // 评估种群
            const evaluated = this.evaluatePopulation(population);
            
            // 更新最佳解决方案
            const currentBest = evaluated[0];
            if (!bestSolution || currentBest.fitness < bestSolution.fitness) {
                bestSolution = currentBest;
            }
            
            // 如果找到精确解决方案，提前结束
            if (bestSolution.fitness === 0) {
                break;
            }
            
            // 更新旧版UI
            if (!this.generationCallback) {
                this.updateUI(generation, bestSolution);
            }
            
            // 计算种群统计数据
            const stats = this.calculateStats(evaluated, bestSolution);
            
            // 调用代际回调函数（如果有）
            if (this.generationCallback) {
                const shouldContinue = await this.generationCallback(generation, evaluated, stats);
                if (shouldContinue === false) {
                    break; // 如果回调返回false，提前终止进化
                }
            } else {
                // 让UI有时间更新
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // 选择、交叉和变异生成新一代
            population = this.evolvePopulation(evaluated);
        }
        
        // 最终更新
        if (!this.generationCallback && this.updateUI) {
            this.updateUI(this.generations, bestSolution);
        }
        
        // 如果最佳解决方案的偏差太大，认为没有找到解决方案
        if (bestSolution.fitness > 0.01 * this.targetNumber) {
            return null;
        }
        
        return {
            expression: this.expressionToString(bestSolution.chromosomes),
            prettyExpression: this.prettyExpression(bestSolution.chromosomes),
            value: bestSolution.value
        };
    }
    
    // 计算种群统计数据
    calculateStats(evaluated, bestSolution) {
        // 计算平均适应度
        const totalFitness = evaluated.reduce((sum, ind) => sum + ind.fitness, 0);
        const averageFitness = totalFitness / evaluated.length;
        
        return {
            bestFitness: bestSolution.fitness,
            averageFitness: averageFitness,
            bestIndividual: bestSolution,
            populationSize: evaluated.length
        };
    }
    
    // 初始化种群
    initializePopulation() {
        const population = [];
        
        for (let i = 0; i < this.populationSize; i++) {
            const individual = {
                chromosomes: this.generateRandomExpression()
            };
            population.push(individual);
        }
        
        return population;
    }
    
    // 生成随机表达式
    generateRandomExpression() {
        const expression = [];
        const numbers = [...this.availableNumbers];
        
        // 随机排列可用数字
        Utils.shuffleArray(numbers);
        
        // 构建表达式
        for (let i = 0; i < numbers.length; i++) {
            // 添加数字
            expression.push({type: 'number', value: numbers[i]});
            
            // 如果不是最后一个数字，添加操作符
            if (i < numbers.length - 1) {
                const operation = this.allowedOperations[Math.floor(Math.random() * this.allowedOperations.length)];
                expression.push({type: 'operation', value: operation});
            }
        }
        
        return expression;
    }
    
    // 评估种群
    evaluatePopulation(population) {
        const evaluated = population.map(individual => {
            const result = this.evaluateExpression(individual.chromosomes);
            return {
                ...individual,
                value: result,
                fitness: Math.abs(this.targetNumber - result)
            };
        });
        
        // 按适应度排序（从低到高）
        return evaluated.sort((a, b) => a.fitness - b.fitness);
    }
    
    // 评估表达式的值
    evaluateExpression(expression) {
        // 处理连接操作
        const processedExpression = this.processConnections(expression);
        
        // 计算表达式
        try {
            return this.calculateExpression(processedExpression);
        } catch (e) {
            return Infinity; // 无效表达式返回无穷大（低适应度）
        }
    }
    
    // 处理数字连接操作
    processConnections(expression) {
        const processed = [];
        
        for (let i = 0; i < expression.length; i++) {
            const current = expression[i];
            
            if (current.type === 'operation' && current.value === 'concat') {
                // 找到前后的数字进行连接
                if (i > 0 && i < expression.length - 1 && 
                    expression[i-1].type === 'number' && 
                    expression[i+1].type === 'number') {
                    
                    // 连接数字
                    const concatenated = parseInt(`${expression[i-1].value}${expression[i+1].value}`);
                    
                    // 替换前一个数字，移除连接操作符和后一个数字
                    processed[processed.length - 1] = {type: 'number', value: concatenated};
                    i++; // 跳过下一个数字
                } else {
                    // 无法连接，保持原样
                    processed.push(current);
                }
            } else {
                processed.push(current);
            }
        }
        
        return processed;
    }
    
    // 计算表达式的值
    calculateExpression(expression) {
        if (expression.length === 0) return 0;
        if (expression.length === 1 && expression[0].type === 'number') return expression[0].value;
        
        // 实现简单的表达式计算
        let result = expression[0].value;
        
        for (let i = 1; i < expression.length; i += 2) {
            const operation = expression[i].value;
            const operand = expression[i+1].value;
            
            switch (operation) {
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
                    if (operand === 0) throw new Error('除以零');
                    result /= operand;
                    break;
                case '^':
                    result = Math.pow(result, operand);
                    break;
                case '%':
                    if (operand === 0) throw new Error('模零');
                    result = result % operand;
                    break;
                default:
                    throw new Error('未知操作符');
            }
        }
        
        return result;
    }
    
    // 生成新一代种群
    evolvePopulation(evaluated) {
        const newPopulation = [];
        
        // 精英保留
        const eliteCount = Math.max(1, Math.floor(this.populationSize * this.elitism));
        for (let i = 0; i < eliteCount; i++) {
            newPopulation.push({chromosomes: [...evaluated[i].chromosomes]});
        }
        
        // 使用锦标赛选择和交叉填充剩余位置
        while (newPopulation.length < this.populationSize) {
            const parent1 = this.tournamentSelection(evaluated);
            const parent2 = this.tournamentSelection(evaluated);
            
            // 交叉操作
            const child = this.crossover(parent1, parent2);
            
            // 变异操作
            if (Math.random() < this.mutationRate) {
                this.mutate(child);
            }
            
            newPopulation.push({chromosomes: child});
        }
        
        return newPopulation;
    }
    
    // 锦标赛选择
    tournamentSelection(evaluated) {
        // 随机选择比赛选手
        const contestants = [];
        for (let i = 0; i < this.tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * evaluated.length);
            contestants.push(evaluated[randomIndex]);
        }
        
        // 选出最佳选手
        return contestants.sort((a, b) => a.fitness - b.fitness)[0];
    }
    
    // 选择父代个体（旧的轮盘赌方法，保留以兼容）
    selectParent(evaluated) {
        // 计算总适应度逆数（因为我们要最小化适应度）
        const totalFitnessInverse = evaluated.reduce((sum, ind) => 
            sum + (1 / (ind.fitness + 1)), 0);
        
        // 轮盘赌选择
        let spin = Math.random() * totalFitnessInverse;
        let position = 0;
        
        for (let i = 0; i < evaluated.length; i++) {
            position += 1 / (evaluated[i].fitness + 1);
            if (position >= spin) {
                return evaluated[i];
            }
        }
        
        return evaluated[0]; // 默认返回最佳个体
    }
    
    // 交叉操作
    crossover(parent1, parent2) {
        // 单点交叉
        const crossPoint = Math.floor(Math.random() * parent1.chromosomes.length);
        
        return [
            ...parent1.chromosomes.slice(0, crossPoint),
            ...parent2.chromosomes.slice(crossPoint)
        ];
    }
    
    // 变异操作
    mutate(chromosomes) {
        // 随机选择变异点
        const mutationPoint = Math.floor(Math.random() * chromosomes.length);
        const gene = chromosomes[mutationPoint];
        
        if (gene.type === 'number') {
            // 随机选择一个可用数字
            gene.value = this.availableNumbers[Math.floor(Math.random() * this.availableNumbers.length)];
        } else if (gene.type === 'operation') {
            // 随机选择一个可用操作
            gene.value = this.allowedOperations[Math.floor(Math.random() * this.allowedOperations.length)];
        }
    }
    
    // 更新UI（旧方法，保留兼容性）
    updateUI(generation, bestSolution) {
        if (!this.progressBar || !this.evolutionStats || !this.bestSolutionsContainer) return;
        
        // 更新进度条
        const progress = ((generation + 1) / this.generations) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        // 更新统计信息
        this.evolutionStats.innerHTML = `
            <p>当前代数: ${generation + 1}/${this.generations}</p>
            <p>最佳解决方案: ${this.prettyExpression(bestSolution.chromosomes)} = ${bestSolution.value}</p>
            <p>与目标的差距: ${bestSolution.fitness.toFixed(2)}</p>
        `;
        
        // 每10代添加一个最佳解决方案卡片
        if (generation % 10 === 0 || generation === this.generations - 1) {
            const solutionCard = document.createElement('div');
            solutionCard.className = 'solution-card';
            solutionCard.innerHTML = `
                <p class="solution-gen">代数 ${generation + 1}</p>
                <p class="solution-expression">${this.prettyExpression(bestSolution.chromosomes)} = ${bestSolution.value}</p>
                <p class="solution-fitness">差距: ${bestSolution.fitness.toFixed(2)}</p>
            `;
            this.bestSolutionsContainer.appendChild(solutionCard);
        }
    }
    
    // 将表达式转换为字符串
    expressionToString(expression) {
        return expression.map(gene => gene.value).join(' ');
    }
    
    // 将表达式转换为美观的字符串
    prettyExpression(expression) {
        let result = '';
        
        for (let i = 0; i < expression.length; i++) {
            const gene = expression[i];
            
            if (gene.type === 'number') {
                result += gene.value;
            } else if (gene.type === 'operation') {
                if (gene.value === 'concat') {
                    result += '⊕'; // 使用特殊符号表示连接
                } else {
                    result += ' ' + gene.value + ' ';
                }
            }
        }
        
        return result;
    }
} 