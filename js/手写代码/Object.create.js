
// Object.create方法的实质是新建一个空的构造函数F，然后让F.prototype属性指向参数对象obj，最后返回一个F的实例，从而实现让该实例继承obj的属性。
Object.prototype.create = function(proto) {
    function F(){};
    F.prototype = proto;
    return new F();
}