function Parent(name) {
    this.parent = name;
}
Parent.prototype.say = function() {
    console.log('this.parent :>> ', this.parent);
}
function Child(name, parent) {
    Parent.call(this, parent); // 继承父类属性
    this.child = name;
}

Child.prototype = Object.create(Parent.prototype); // Object.create创建了父类原型的副本，与父类原型完全隔离
Child.prototype.say = function() {
    console.log('this.child :>> ', this.child);
}
Child.prototype.constructor = Child;

var parent = new Parent('father');
parent.say() // this.parent :>>  father

var child = new Child('child', 'father');
child.say() // this.child :>>  child