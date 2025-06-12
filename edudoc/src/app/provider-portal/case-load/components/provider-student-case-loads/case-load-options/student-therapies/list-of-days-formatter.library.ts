import { IStudentTherapy } from '@model/interfaces/student-therapy';

const getListOfDays: (studentTherapy: IStudentTherapy) => string = (studentTherapy: IStudentTherapy) => {
    const result = [];
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    for (const [key, value] of Object.entries(studentTherapy)) {
        if (daysOfWeek.includes(key.toLocaleLowerCase()) && value) {
            result.push(key);
        }
    }
    return result.join(', ');
};

export default getListOfDays;
