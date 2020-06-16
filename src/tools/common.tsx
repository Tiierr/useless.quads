import p1 from '../static/img/p1.jpg';
import p2 from '../static/img/p2.jpg';
import p3 from '../static/img/p3.png';
import p4 from '../static/img/p4.jpeg';


const findImage = (): Array<string> => {
    return [p1, p2, p3, p4]
};


const getRandom = (data: Array<string>): string => {
    return data[Math.floor(Math.random() * data.length)]
};

export {
    findImage,
    getRandom
}
