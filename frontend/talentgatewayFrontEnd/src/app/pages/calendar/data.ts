import { EventInput } from '@fullcalendar/core';
import { InterviewService } from '../../services/interview.service';
let eventGuid = 0;
export function createEventId() {
    return String(eventGuid++);
}

const category = [
    {
        name: 'Danger',
        value: 'bg-danger'
    },
    {
        name: 'Success',
        value: 'bg-success'
    },
    {
        name: 'Primary',
        value: 'bg-primary'
    },
    {
        name: 'Info',
        value: 'bg-info'
    },
    {
        name: 'Dark',
        value: 'bg-dark'
    },
    {
        name: 'Warning',
        value: 'bg-warning'
    },
];

 
// Supprimez les crochets d'exportation de cette constante, elle doit être exportée seule
const calendarEvents: EventInput[] = [  {
    title: 'Interview 2',
    start: '2024-04-15 03:10',
    end: '2024-04-15 04:10'
},];

// Exportez calendarEvents et category
export { calendarEvents, category };
