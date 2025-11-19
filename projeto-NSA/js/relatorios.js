document.addEventListener("DOMContentLoaded", () => {
    const chartContainer = document.getElementById('main-chart');
    const listContainer = document.getElementById('absences-list-container');
    const reportTypeSelect = document.getElementById('report-type-select');

    let absencesData = [];
    const myChart = echarts.init(chartContainer);

    async function loadAbsencesData() {
        try {
            const response = await fetch('js/faltas.json');
            absencesData = await response.json();
            renderReport();
        } catch (error) {
            console.error('Erro ao carregar os dados de faltas:', error);
            listContainer.innerHTML = '<p>Erro ao carregar a lista de faltas.</p>';
        }
    }

    function renderReport() {
        const selectedReportType = reportTypeSelect.value;
        if (selectedReportType === 'presencas') {
            listContainer.style.display = 'none';
            chartContainer.style.display = 'block';
            renderChart();
        } else {
            chartContainer.style.display = 'none';
            listContainer.style.display = 'block';
            renderAbsencesList();
        }
    }

    function renderChart() {
    const chartData = {
        title: 'Presença por Turma (Informática)',
        seriesName: 'Porcentagem de Presença',
        data: [
            { value: 95, name: 'Turma A' },
            { value: 88, name: 'Turma B' }
        ]
    };
    const option = {
        title: { text: chartData.title, left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
        series: [{
            name: chartData.seriesName,
            type: 'pie',
            radius: '50%',
            data: chartData.data,
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    };
    myChart.setOption(option);
}
    function renderAbsencesList() {
        listContainer.innerHTML = '';

        const title = document.createElement('h3');
        title.textContent = 'Faltas por Aluno';
        listContainer.appendChild(title);

        const list = document.createElement('ul');
        list.classList.add('absence-list');

        absencesData.forEach(student => {
            const listItem = document.createElement('li');
            listItem.classList.add('student-item');
            const studentName = document.createElement('strong');
            studentName.textContent = student.aluno;
            listItem.appendChild(studentName);

            const absencesContent = document.createElement('div');
            student.faltas.forEach(falta => {
                const absenceItem = document.createElement('p');
                absenceItem.textContent = `• ${falta.data} - Aula: ${falta.aula}`;
                absencesContent.appendChild(absenceItem);
            });

            listItem.appendChild(absencesContent);
            list.appendChild(listItem);
        });

        listContainer.appendChild(list);
    }

    reportTypeSelect.addEventListener('change', renderReport);
    loadAbsencesData();
});