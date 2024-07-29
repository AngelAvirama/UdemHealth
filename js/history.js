document.addEventListener('DOMContentLoaded', function() {
    const historyContainer = document.getElementById('history');
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Filtrar el historial para el usuario logueado
    const userHistory = history.filter(record => record.patient === loggedInUser);

    if (userHistory.length === 0) {
        historyContainer.innerHTML = '<p>No tienes historial clínico.</p>';
        return;
    }

    userHistory.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.className = 'appointment';
        recordElement.innerHTML = `
            <div class="appointment-card">
                <p><strong>IPS:</strong> ${record.ip}</p>
                <p><strong>Fecha:</strong> ${new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> ${record.time}</p>
                <p><strong>Discapacidad:</strong> ${record.disability}</p>
            </div>
        `;
        historyContainer.appendChild(recordElement);
    });
});
