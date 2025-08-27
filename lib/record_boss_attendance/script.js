// 出勤记录数据结构
class AttendanceRecord {
    constructor(bossName, recordType, time, description = '', customDate = null) {
        this.id = Date.now() + Math.random();
        this.bossName = bossName;
        this.recordType = recordType; // 'arrive' 或 'leave'
        this.time = time;
        this.description = description;
        this.date = customDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD 格式
        this.timestamp = new Date().getTime();
    }
}

// 应用主类
class AttendanceApp {
    constructor() {
        this.records = this.loadRecords();
        this.init();
    }

    // 初始化应用
    init() {
        this.setupEventListeners();
        this.setDefaultTime();
        this.setupDateSelector();
        
        // 检查是否有数据，如果没有则尝试自动加载CSV文件
        if (this.records.length === 0) {
            // 显示加载提示
            this.showLoadingMessage();
            this.autoLoadCSV();
        }
        
        this.renderRecordsTable();
        this.renderTimeline();
    }

    // 显示加载提示
    showLoadingMessage() {
        const timelineContainer = document.getElementById('timeline');
        if (timelineContainer) {
            timelineContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <div style="font-size: 1.2rem; margin-bottom: 20px;">正在尝试自动加载数据...</div>
                    <div style="font-size: 0.9rem; color: #a0aec0;">
                        系统正在查找并加载同目录下的CSV文件<br>
                        支持的文件名: 出勤记录.csv, attendance.csv, 考勤记录.csv, 出勤.csv
                    </div>
                </div>
            `;
        }
    }

    // 自动加载CSV文件
    async autoLoadCSV() {
        try {
            console.log('尝试自动加载CSV文件...');
            
            // 尝试多种可能的文件名
            const possibleFileNames = [
                './出勤记录.csv',
                './attendance.csv',
                './考勤记录.csv',
                './出勤.csv'
            ];
            
            let csvContent = null;
            let loadedFileName = null;
            
            // 依次尝试不同的文件名
            for (const fileName of possibleFileNames) {
                try {
                    console.log(`尝试加载文件: ${fileName}`);
                    const response = await fetch(fileName);
                    
                    if (response.ok) {
                        csvContent = await response.text();
                        loadedFileName = fileName;
                        console.log(`成功读取文件: ${fileName}`);
                        break;
                    }
                } catch (error) {
                    console.log(`文件 ${fileName} 加载失败:`, error.message);
                    continue;
                }
            }
            
            if (!csvContent) {
                console.log('未找到任何可用的CSV文件');
                this.showNoDataMessage();
                return;
            }
            
            console.log('开始解析CSV内容...');
            
            const importedRecords = this.parseCSV(csvContent);
            
            if (importedRecords.length === 0) {
                console.log('CSV文件解析失败或为空');
                this.showNoDataMessage();
                return;
            }
            
            console.log(`自动导入成功: ${importedRecords.length} 条记录`);
            
            // 自动导入数据
            this.records = importedRecords;
            this.saveRecords();
            
            // 重新渲染界面
            this.renderRecordsTable();
            this.renderTimeline();
            this.renderAvailableDates();
            
            // 自动选择第一个导入的日期
            const dates = [...new Set(importedRecords.map(r => r.date))].sort();
            if (dates.length > 0) {
                const firstDate = dates[0];
                document.getElementById('selectedDate').value = firstDate;
                
                // 手动触发change事件
                const event = new Event('change', { bubbles: true });
                document.getElementById('selectedDate').dispatchEvent(event);
                
                console.log(`自动选择日期: ${firstDate}`);
                
                // 显示成功消息
                setTimeout(() => {
                    alert(`自动加载成功！\n文件: ${loadedFileName}\n导入了 ${importedRecords.length} 条记录\n日期范围: ${dates[0]} 到 ${dates[dates.length - 1]}`);
                }, 500);
            }
            
        } catch (error) {
            console.log('自动加载CSV文件失败:', error.message);
            this.showNoDataMessage();
        }
    }

    // 显示无数据提示
    showNoDataMessage() {
        const timelineContainer = document.getElementById('timeline');
        if (timelineContainer) {
            timelineContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <div style="font-size: 1.2rem; margin-bottom: 20px;">暂无数据</div>
                    <div style="font-size: 0.9rem; color: #a0aec0; margin-bottom: 20px;">
                        系统未找到可用的CSV文件<br>
                        您可以手动添加记录或导入CSV文件
                    </div>
                    <div style="font-size: 0.9rem; color: #667eea; margin-bottom: 20px;">
                        支持的文件名: 出勤记录.csv, attendance.csv, 考勤记录.csv, 出勤.csv<br>
                        请将CSV文件放在与HTML文件相同的目录下
                    </div>
                    <button onclick="window.attendanceApp.retryAutoLoad()" class="btn btn-primary" style="margin: 10px;">
                        🔄 重新尝试自动加载
                    </button>
                    <button onclick="window.attendanceApp.importFromCSV()" class="btn btn-secondary" style="margin: 10px;">
                        📥 手动导入CSV
                    </button>
                </div>
            `;
        }
    }

    // 重新尝试自动加载
    retryAutoLoad() {
        console.log('用户手动触发重新加载...');
        this.showLoadingMessage();
        this.autoLoadCSV();
    }

    // 设置事件监听器
    setupEventListeners() {
        document.getElementById('addRecord').addEventListener('click', () => this.addRecord());
        document.getElementById('importCSV').addEventListener('click', () => this.importFromCSV());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportToCSV());
        document.getElementById('clearData').addEventListener('click', () => this.clearData());
        
        // 回车键提交
        document.getElementById('bossName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addRecord();
        });
    }

    // 设置日期选择器
    setupDateSelector() {
        // 设置默认日期
        document.getElementById('selectedDate').value = new Date().toISOString().split('T')[0];
        
        // 添加事件监听器
        document.getElementById('selectedDate').addEventListener('change', () => {
            console.log('日期选择器变更:', document.getElementById('selectedDate').value);
            this.renderRecordsTable();
            this.renderTimeline();
        });
        
        document.getElementById('prevDate').addEventListener('click', () => this.navigateDate(-1));
        document.getElementById('nextDate').addEventListener('click', () => this.navigateDate(1));
        document.getElementById('today').addEventListener('click', () => this.goToToday());
        
        // 渲染可用日期列表
        this.renderAvailableDates();
    }

    // 渲染可用日期列表
    renderAvailableDates() {
        const dateListContainer = document.getElementById('dateList');
        const availableDates = [...new Set(this.records.map(r => r.date))].sort().reverse();
        
        if (availableDates.length === 0) {
            dateListContainer.innerHTML = '<span class="no-dates">暂无记录</span>';
            return;
        }

        const dateListHTML = availableDates.map(date => {
            const recordCount = this.records.filter(r => r.date === date).length;
            return `<span class="date-tag" data-date="${date}">${date} (${recordCount}条)</span>`;
        }).join('');

        dateListContainer.innerHTML = dateListHTML;

        // 添加点击事件
        dateListContainer.querySelectorAll('.date-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const selectedDate = tag.dataset.date;
                console.log('点击日期标签:', selectedDate);
                
                // 更新日期选择器的值
                document.getElementById('selectedDate').value = selectedDate;
                
                // 手动触发change事件，确保所有监听器都能收到通知
                const event = new Event('change', { bubbles: true });
                document.getElementById('selectedDate').dispatchEvent(event);
                
                // 直接调用渲染方法作为备选
                this.renderRecordsTable();
                this.renderTimeline();
            });
        });
    }

    // 导航到指定日期
    navigateDate(direction) {
        const dateInput = document.getElementById('selectedDate');
        const currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() + direction);
        const newDate = currentDate.toISOString().split('T')[0];
        
        console.log(`导航日期: ${dateInput.value} -> ${newDate} (方向: ${direction})`);
        
        dateInput.value = newDate;
        
        // 手动触发change事件
        const event = new Event('change', { bubbles: true });
        dateInput.dispatchEvent(event);
        
        // 直接调用渲染方法
        this.renderRecordsTable();
        this.renderTimeline();
    }

    // 跳转到今天
    goToToday() {
        const today = new Date().toISOString().split('T')[0];
        console.log('跳转到今天:', today);
        
        document.getElementById('selectedDate').value = today;
        
        // 手动触发change事件
        const event = new Event('change', { bubbles: true });
        document.getElementById('selectedDate').dispatchEvent(event);
        
        // 直接调用渲染方法
        this.renderRecordsTable();
        this.renderTimeline();
    }

    // 设置默认时间为当前时间（限制在工作时间内）
    setDefaultTime() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // 如果当前时间在工作时间外，设置为9:00
        if (currentHour < 9 || (currentHour === 9 && currentMinute < 0) || 
            currentHour > 18 || (currentHour === 18 && currentMinute > 30)) {
            document.getElementById('recordTime').value = '09:00';
        } else {
            // 将时间调整到最近的15分钟间隔
            const adjustedMinute = Math.floor(currentMinute / 15) * 15;
            const timeString = `${currentHour.toString().padStart(2, '0')}:${adjustedMinute.toString().padStart(2, '0')}`;
            document.getElementById('recordTime').value = timeString;
        }
    }

    // 添加新记录
    addRecord() {
        const bossName = document.getElementById('bossName').value.trim();
        const recordType = document.getElementById('recordType').value;
        const time = document.getElementById('recordTime').value;
        const description = document.getElementById('description').value.trim();
        const selectedDate = document.getElementById('selectedDate').value;

        if (!bossName || !time) {
            alert('请填写老板姓名和时间！');
            return;
        }

        // 验证时间是否在工作时间范围内
        if (!this.isValidWorkTime(time)) {
            alert('时间必须在09:00-18:30范围内！');
            return;
        }

        // 验证时间逻辑
        if (recordType === 'leave') {
            const dateRecords = this.getDateRecords(selectedDate, bossName);
            const lastArrive = dateRecords.filter(r => r.recordType === 'arrive').pop();
            if (!lastArrive) {
                alert('该老板在选择的日期还没有到达记录，无法记录离开！');
                return;
            }
            if (time <= lastArrive.time) {
                alert('离开时间不能早于或等于到达时间！');
                return;
            }
        }

        const record = new AttendanceRecord(bossName, recordType, time, description, selectedDate);
        this.records.push(record);
        this.saveRecords();
        
        // 清空表单
        document.getElementById('bossName').value = '';
        document.getElementById('description').value = '';
        this.setDefaultTime();
        
        // 重新渲染
        this.renderRecordsTable();
        this.renderTimeline();
        this.renderAvailableDates();
        
        alert('记录添加成功！');
    }

    // 获取指定日期的记录
    getDateRecords(date, bossName = null) {
        let dateRecords = this.records.filter(r => r.date === date);
        
        if (bossName) {
            dateRecords = dateRecords.filter(r => r.bossName === bossName);
        }
        
        return dateRecords.sort((a, b) => a.time.localeCompare(b.time));
    }

    // 获取今日记录（保持向后兼容）
    getTodayRecords(bossName = null) {
        const today = new Date().toISOString().split('T')[0];
        return this.getDateRecords(today, bossName);
    }

    // 渲染出勤记录表格
    renderRecordsTable() {
        const selectedDate = document.getElementById('selectedDate').value;
        const allBosses = [...new Set(this.records.map(r => r.bossName))];
        const tableBody = document.getElementById('recordsTableBody');
        
        console.log(`渲染记录表格: 日期=${selectedDate}, 老板数量=${allBosses.length}`);
        
        if (allBosses.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #718096; padding: 20px;">暂无老板记录</td></tr>';
            console.log('暂无老板记录');
            return;
        }

        const tableRows = allBosses.map(bossName => {
            const bossRecords = this.getDateRecords(selectedDate, bossName);
            const status = this.getBossStatus(bossRecords);
            const timeInfo = this.getBossTimeInfo(bossRecords);
            
            console.log(`老板 ${bossName}: 状态=${status.text}, 到达=${timeInfo.arriveTime}, 离开=${timeInfo.leaveTime}`);
            
            return `
                <tr>
                    <td><strong>${bossName}</strong></td>
                    <td>
                        <span class="status-badge status-${status.class}">${status.text}</span>
                    </td>
                    <td>${timeInfo.arriveTime || '-'}</td>
                    <td>${timeInfo.leaveTime || '-'}</td>
                    <td>${timeInfo.totalTime || '-'}</td>
                    <td>${timeInfo.description || '-'}</td>
                </tr>
            `;
        }).join('');

        tableBody.innerHTML = tableRows;
        console.log(`记录表格渲染完成: ${selectedDate}`);
    }

    // 获取老板时间信息
    getBossTimeInfo(records) {
        if (records.length === 0) {
            return { arriveTime: null, leaveTime: null, totalTime: null, description: null };
        }

        const arrives = records.filter(r => r.recordType === 'arrive');
        const leaves = records.filter(r => r.recordType === 'leave');
        
        let arriveTime = arrives.length > 0 ? arrives[0].time : null;
        let leaveTime = leaves.length > 0 ? leaves[leaves.length - 1].time : null;
        let totalTime = null;
        let description = null;

        // 计算在办公室总时长
        if (arriveTime && leaveTime) {
            const totalMinutes = this.calculateTimeDifference(arriveTime, leaveTime);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            totalTime = `${hours}小时${minutes}分钟`;
        } else if (arriveTime) {
            totalTime = '至今';
        }

        // 获取描述信息
        if (records.length > 0) {
            const descriptions = records.map(r => r.description).filter(d => d).join(', ');
            if (descriptions) {
                description = descriptions;
            }
        }

        return { arriveTime, leaveTime, totalTime, description };
    }

    // 获取老板状态
    getBossStatus(records) {
        if (records.length === 0) {
            return { class: 'absent', text: '今日未到' };
        }

        const arrives = records.filter(r => r.recordType === 'arrive');
        const leaves = records.filter(r => r.recordType === 'leave');

        if (arrives.length === 0) {
            return { class: 'absent', text: '今日未到' };
        }

        if (leaves.length === 0) {
            return { class: 'present', text: '在办公室' };
        }

        // 检查最后一条记录
        const lastRecord = records[records.length - 1];
        if (lastRecord.recordType === 'arrive') {
            return { class: 'present', text: '在办公室' };
        } else {
            return { class: 'partial', text: '已离开' };
        }
    }

    // 获取老板出勤摘要
    getBossSummary(records) {
        if (records.length === 0) return '无记录';
        
        const arrives = records.filter(r => r.recordType === 'arrive');
        const leaves = records.filter(r => r.recordType === 'leave');
        
        let summary = `到达 ${arrives.length} 次`;
        if (leaves.length > 0) {
            summary += `，离开 ${leaves.length} 次`;
        }
        
        const firstArrive = arrives[0];
        if (firstArrive) {
            summary += `<br>首次到达: ${firstArrive.time}`;
        }
        
        return summary;
    }

    // 渲染水平时间轴
    renderTimeline() {
        const timelineContainer = document.getElementById('timeline');
        const selectedDate = document.getElementById('selectedDate').value;
        const dateRecords = this.getDateRecords(selectedDate);
        
        console.log(`渲染时间轴: 日期=${selectedDate}, 记录数量=${dateRecords.length}`);
        
        if (dateRecords.length === 0) {
            timelineContainer.innerHTML = `<p style="text-align: center; color: #718096;">${selectedDate} 暂无记录</p>`;
            console.log(`日期 ${selectedDate} 暂无记录`);
            return;
        }

        // 获取所有老板
        const allBosses = [...new Set(dateRecords.map(r => r.bossName))];
        console.log(`老板列表:`, allBosses);
        
        // 生成时间刻度（从6:00到22:00，每30分钟一个刻度）
        const timeSlots = this.generateTimeSlots();
        
        let timelineHTML = `
            <div class="horizontal-timeline">
                <div class="timeline-title">
                    <h3>${selectedDate} 出勤时间轴</h3>
                    <div class="timeline-info">时间精度：30分钟 | 时间范围：09:00-18:30</div>
                </div>
                <div class="timeline-header">
                    <div class="boss-label">老板</div>
                    ${timeSlots.map(time => `<div class="time-slot">${time}</div>`).join('')}
                </div>
        `;

        // 为每个老板创建时间轴
        allBosses.forEach(bossName => {
            const bossRecords = dateRecords.filter(r => r.bossName === bossName);
            timelineHTML += this.renderBossTimeline(bossName, bossRecords, timeSlots);
        });

        timelineHTML += '</div>';
        timelineContainer.innerHTML = timelineHTML;
        
        console.log(`时间轴渲染完成: ${selectedDate}`);
    }

    // 生成连续时间刻度
    generateTimeSlots() {
        const slots = [];
        // 从9:00到18:30，每30分钟一个刻度，确保所有时间槽大小一致
        for (let hour = 9; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            // 添加半点刻度（除了18:30，因为18:30后不在工作时间内）
            if (hour < 18) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        // 添加18:30这个特殊时间点
        slots.push('18:30');
        return slots;
    }

    // 渲染单个老板的时间轴
    renderBossTimeline(bossName, bossRecords, timeSlots) {
        const sortedRecords = bossRecords.sort((a, b) => a.time.localeCompare(b.time));
        
        let timelineHTML = `<div class="boss-timeline-row">`;
        timelineHTML += `<div class="boss-name">${bossName}</div>`;
        
        // 为每个时间槽创建单元格
        timeSlots.forEach((timeSlot, index) => {
            const record = this.findRecordAtTime(sortedRecords, timeSlot);
            const cellClass = this.getTimelineCellClass(record, timeSlot);
            const cellContent = this.getTimelineCellContent(record, timeSlot);
            
            // 检查是否有记录在这个时间点
            const hasRecord = sortedRecords.some(r => r.time === timeSlot);
            
            // 如果有记录，添加特殊类名用于边界标记
            const boundaryClass = hasRecord ? 'boundary-cell' : '';
            
            timelineHTML += `<div class="timeline-cell ${cellClass} ${boundaryClass}">${cellContent}</div>`;
        });
        
        timelineHTML += '</div>';
        return timelineHTML;
    }

    // 获取时间轴单元格的CSS类
    getTimelineCellClass(recordInfo, timeSlot) {
        if (recordInfo.status === 'present') {
            return 'present';
        } else if (recordInfo.status === 'absent') {
            return 'absent';
        }
        return 'empty';
    }

    // 获取时间轴单元格的内容
    getTimelineCellContent(recordInfo, timeSlot) {
        if (recordInfo.record && recordInfo.record.time === timeSlot) {
            const icon = recordInfo.record.recordType === 'arrive' ? '🟢' : '🔴';
            const action = recordInfo.record.recordType === 'arrive' ? '到' : '离';
            const description = recordInfo.record.description ? `\n${recordInfo.record.description}` : '';
            return `<div class="cell-content record-marker" title="${action}${description}">${icon} ${action}</div>`;
        }
        
        // 为连续时间轴添加状态指示
        if (recordInfo.status === 'present') {
            return `<div class="cell-content status-indicator" title="在办公室">●</div>`;
        } else if (recordInfo.status === 'absent') {
            return `<div class="cell-content status-indicator" title="不在办公室">○</div>`;
        }
        
        return '';
    }

    // 查找指定时间的记录状态
    findRecordAtTime(records, timeSlot) {
        const [hour, minute] = timeSlot.split(':').map(Number);
        const targetMinutes = hour * 60 + minute;
        
        // 找到最接近的到达记录
        let currentStatus = 'absent';
        let currentRecord = null;
        let lastArriveTime = null;
        let lastLeaveTime = null;
        
        for (const record of records) {
            const [recordHour, recordMinute] = record.time.split(':').map(Number);
            const recordMinutes = recordHour * 60 + recordMinute;
            
            if (recordMinutes <= targetMinutes) {
                if (record.recordType === 'arrive') {
                    lastArriveTime = recordMinutes;
                    currentRecord = record;
                } else if (record.recordType === 'leave') {
                    lastLeaveTime = recordMinutes;
                }
            }
        }
        
        // 确定当前状态：如果最后一条记录是到达且没有后续离开，则在办公室
        if (lastArriveTime !== null && (lastLeaveTime === null || lastArriveTime > lastLeaveTime)) {
            currentStatus = 'present';
        } else {
            currentStatus = 'absent';
        }
        
        return { status: currentStatus, record: currentRecord };
    }

    // 验证时间是否在工作时间范围内
    isValidWorkTime(time) {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute;
        
        const startMinutes = 9 * 60; // 09:00
        const endMinutes = 18 * 60 + 30; // 18:30
        
        return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
    }

    // 计算时间差（分钟）
    calculateTimeDifference(time1, time2) {
        const [hour1, minute1] = time1.split(':').map(Number);
        const [hour2, minute2] = time2.split(':').map(Number);
        
        const totalMinutes1 = hour1 * 60 + minute1;
        const totalMinutes2 = hour2 * 60 + minute2;
        
        return Math.abs(totalMinutes2 - totalMinutes1);
    }

    // 保存记录到本地存储
    saveRecords() {
        localStorage.setItem('attendanceRecords', JSON.stringify(this.records));
    }

    // 从本地存储加载记录
    loadRecords() {
        const saved = localStorage.getItem('attendanceRecords');
        return saved ? JSON.parse(saved) : [];
    }

    // 导入CSV
    importFromCSV() {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
        
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                alert('请选择CSV文件！');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvContent = e.target.result;
                    const importedRecords = this.parseCSV(csvContent);
                    
                    if (importedRecords.length === 0) {
                        alert('CSV文件格式不正确或为空！');
                        return;
                    }
                    
                    // 询问用户是否要合并或替换数据
                    const action = confirm(
                        `成功解析 ${importedRecords.length} 条记录。\n` +
                        '选择"确定"合并数据，选择"取消"替换现有数据。'
                    );
                    
                    if (action) {
                        // 合并数据
                        this.mergeRecords(importedRecords);
                        alert(`成功合并 ${importedRecords.length} 条记录！\n现有记录总数: ${this.records.length} 条`);
                    } else {
                        // 替换数据
                        this.records = importedRecords;
                        this.saveRecords();
                        alert(`成功导入 ${importedRecords.length} 条记录，替换了现有数据！`);
                    }
                    
                    // 重新渲染界面
                    this.renderRecordsTable();
                    this.renderTimeline();
                    this.renderAvailableDates();
                    
                    // 显示导入的日期范围
                    const dates = [...new Set(importedRecords.map(r => r.date))].sort();
                    if (dates.length > 0) {
                        console.log(`导入的日期范围: ${dates[0]} 到 ${dates[dates.length - 1]}`);
                        // 自动选择第一个导入的日期
                        const firstDate = dates[0];
                        document.getElementById('selectedDate').value = firstDate;
                        
                        // 手动触发change事件，确保所有监听器都能收到通知
                        const event = new Event('change', { bubbles: true });
                        document.getElementById('selectedDate').dispatchEvent(event);
                        
                        // 直接调用渲染方法
                        this.renderRecordsTable();
                        this.renderTimeline();
                        
                        console.log(`已选择日期: ${firstDate}`);
                    }
                    
                } catch (error) {
                    alert('导入失败：' + error.message);
                }
            };
            
            reader.readAsText(file, 'UTF-8');
        });
        
        // 清空文件输入，允许重复选择同一文件
        fileInput.value = '';
    }

    // 解析CSV内容
    parseCSV(csvContent) {
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV文件至少需要标题行和一行数据');
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        console.log('CSV标题:', headers);
        
        // 验证标题格式
        const expectedHeaders = ['日期', '老板姓名', '记录类型', '时间', '描述'];
        if (!expectedHeaders.every(h => headers.includes(h))) {
            throw new Error(`CSV标题格式不正确。期望: ${expectedHeaders.join(', ')}，实际: ${headers.join(', ')}`);
        }
        
        const records = [];
        let lineNumber = 1;
        
        for (let i = 1; i < lines.length; i++) {
            lineNumber = i + 1;
            const values = this.parseCSVLine(lines[i]);
            console.log(`第${lineNumber}行数据:`, values);
            
            if (values.length >= 4) {
                try {
                    // 转换日期格式
                    const convertedDate = this.convertDateFormat(values[0]);
                    console.log(`日期转换: ${values[0]} -> ${convertedDate}`);
                    
                    const record = new AttendanceRecord(
                        values[1], // 老板姓名
                        values[2] === '到达' ? 'arrive' : 'leave', // 记录类型
                        values[3], // 时间
                        values[4] || '', // 描述
                        convertedDate // 转换后的日期
                    );
                    records.push(record);
                    console.log(`成功创建记录:`, record);
                } catch (error) {
                    console.error(`第${lineNumber}行解析失败:`, error);
                    throw new Error(`第${lineNumber}行数据格式错误: ${error.message}`);
                }
            } else {
                console.warn(`第${lineNumber}行数据不完整，跳过:`, values);
            }
        }
        
        console.log(`成功解析 ${records.length} 条记录`);
        return records;
    }

    // 转换日期格式
    convertDateFormat(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') {
            console.warn(`无效的日期字符串: ${dateStr}，使用当前日期`);
            return new Date().toISOString().split('T')[0];
        }
        
        // 处理 DD/M/YYYY 或 DD/MM/YYYY 格式
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                let year = parts[2];
                
                // 确保年份是4位数
                if (year.length === 2) {
                    year = '20' + year;
                }
                
                // 验证日期是否有效
                const date = new Date(`${year}-${month}-${day}`);
                if (isNaN(date.getTime())) {
                    console.warn(`无效的日期: ${dateStr}，使用当前日期`);
                    return new Date().toISOString().split('T')[0];
                }
                
                return `${year}-${month}-${day}`;
            }
        }
        
        // 处理 YYYY-MM-DD 格式（已经是标准格式）
        if (dateStr.includes('-') && dateStr.length === 10) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return dateStr;
            }
        }
        
        // 处理 DD-MM-YYYY 格式
        if (dateStr.includes('-') && dateStr.length === 10) {
            const parts = dateStr.split('-');
            if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];
                
                const date = new Date(`${year}-${month}-${day}`);
                if (!isNaN(date.getTime())) {
                    return `${year}-${month}-${day}`;
                }
            }
        }
        
        // 如果无法解析，返回当前日期
        console.warn(`无法解析日期格式: ${dateStr}，使用当前日期`);
        return new Date().toISOString().split('T')[0];
    }

    // 解析CSV行（处理包含逗号的字段）
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    // 合并记录（避免重复）
    mergeRecords(newRecords) {
        const existingIds = new Set(this.records.map(r => r.id));
        
        newRecords.forEach(newRecord => {
            // 生成新的ID避免冲突
            newRecord.id = Date.now() + Math.random();
            
            // 检查是否已存在相同的记录（基于日期、老板、类型、时间）
            const isDuplicate = this.records.some(existing => 
                existing.date === newRecord.date &&
                existing.bossName === newRecord.bossName &&
                existing.recordType === newRecord.recordType &&
                existing.time === newRecord.time
            );
            
            if (!isDuplicate) {
                this.records.push(newRecord);
            }
        });
        
        this.saveRecords();
    }

    // 导出为CSV
    exportToCSV() {
        if (this.records.length === 0) {
            alert('暂无数据可导出！');
            return;
        }

        const headers = ['日期', '老板姓名', '记录类型', '时间', '描述'];
        const csvContent = [
            headers.join(','),
            ...this.records.map(record => [
                record.date,
                record.bossName,
                record.recordType === 'arrive' ? '到达' : '离开',
                record.time,
                record.description
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `出勤记录_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 清空数据
    clearData() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            this.records = [];
            this.saveRecords();
            this.renderRecordsTable();
            this.renderTimeline();
            this.renderAvailableDates();
            alert('数据已清空！');
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.attendanceApp = new AttendanceApp();
});
