const regex = /\bjavascript\b|\becmascript\b|(?<!node\.)(?<!node)(?<!react)(?<!vue)\bjs\b/i;

const text1 = 'Desenvolvedor React Senior Vaga para atuar com ReactJS, TypeScript e Node.js';
const text2 = 'Engenheiro Java Pleno Requisitos: Java 17, Spring Boot, SQL e Docker';
const text3 = 'Desenvolvedor JavaScript Júnior Vaga Júnior para atuar com JS e Python';

console.log('Text 1 (React, TS, Node.js):', regex.test(text1));
console.log('Text 2 (Java):', regex.test(text2));
console.log('Text 3 (JavaScript, JS, Python):', regex.test(text3));
