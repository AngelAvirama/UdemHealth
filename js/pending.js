document.addEventListener('DOMContentLoaded', function() {
    const appointmentsContainer = document.getElementById('appointments');
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentDate = new Date();

    if (appointments.length === 0) {
        appointmentsContainer.innerHTML = '<p>No tienes citas pendientes.</p>';
        return;
    }

    // Filtrar citas para el usuario logueado
    const userAppointments = appointments.filter(app => app.patient === loggedInUser);

    if (userAppointments.length === 0) {
        appointmentsContainer.innerHTML = '<p>No tienes citas pendientes.</p>';
        return;
    }

    // Filtrar citas pasadas y moverlas al historial clínico
    const futureAppointments = [];
    const pastAppointments = [];

    userAppointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate < currentDate) {
            pastAppointments.push(appointment);
        } else {
            futureAppointments.push(appointment);
        }
    });

    // Guardar citas futuras
    localStorage.setItem('appointments', JSON.stringify(futureAppointments));

    // Guardar citas pasadas en historial clínico
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(...pastAppointments);
    localStorage.setItem('history', JSON.stringify(history));

    // Mostrar citas futuras
    function renderAppointments() {
        appointmentsContainer.innerHTML = '';

        futureAppointments.forEach((appointment, index) => {
            const appointmentElement = document.createElement('div');
            appointmentElement.className = 'appointment';
            appointmentElement.innerHTML = `
                <div class="appointment-card">
                    <p><strong>IPS:</strong> ${appointment.clinic}</p>
                    <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> ${appointment.time}</p>
                    <p><strong>Discapacidad:</strong> ${appointment.disability}</p>
                    <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                    <button class="cancel-button" data-index="${index}">Cancelar Cita</button>
                </div>
            `;
            appointmentsContainer.appendChild(appointmentElement);
        });

        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', function() {
                const appointmentIndex = this.getAttribute('data-index');
                cancelAppointment(appointmentIndex);
            });
        });
    }

    function cancelAppointment(index) {
        const confirmation = confirm('¿Estás seguro de que deseas cancelar esta cita?');
        if (confirmation) {
            futureAppointments.splice(index, 1);
            localStorage.setItem('appointments', JSON.stringify(futureAppointments));
            renderAppointments();
        }
    }

    renderAppointments();
});
