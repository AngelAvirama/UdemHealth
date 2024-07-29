document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointment-form');

    // Obtener el nombre de la clínica desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const clinicName = urlParams.get('name');
    if (clinicName) {
        document.getElementById('clinic-name').value = clinicName;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const disability = document.getElementById('disability').value;
        const selectedDateTime = new Date(`${date}T${time}`);
        const currentDateTime = new Date();
        const clinic = document.getElementById('clinic-name').value;

        if (selectedDateTime <= currentDateTime) {
            alert('Fecha y hora inválida. Debe ser posterior a la fecha y hora actuales.');
            return;
        }

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const loggedInUser = localStorage.getItem('loggedInUser');

        // Verificar si ya existe una cita en el mismo horario o dentro de una hora antes o después
        const conflictingAppointment = appointments.some(app => {
            const appointmentDateTime = new Date(app.date);
            const timeDiff = Math.abs(appointmentDateTime - selectedDateTime) / (1000 * 60); // Diferencia en minutos
            return app.clinic === clinic && timeDiff < 60;
        });

        if (conflictingAppointment) {
            alert('Ya existe una cita en el mismo horario o en un intervalo de una hora antes o después.');
            return;
        }

        // Agregar la nueva cita
        const newAppointment = {
            clinic: clinic,
            patient: loggedInUser,
            date: selectedDateTime.toISOString(),
            time: time,
            disability: disability
        };

        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        alert('Cita programada exitosamente.');
        window.location.href = 'pending.html';
    });
});
