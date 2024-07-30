'use strict';
var hi = Object.create;
var xt = Object.defineProperty;
var mi = Object.getOwnPropertyDescriptor;
var yi = Object.getOwnPropertyNames;
var gi = Object.getPrototypeOf,
    _i = Object.prototype.hasOwnProperty;
var _ = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    $i = (t, e) => {
        for (var r in e) xt(t, r, { get: e[r], enumerable: !0 });
    },
    hn = (t, e, r, s) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
            for (let n of yi(e))
                !_i.call(t, n) && n !== r && xt(t, n, { get: () => e[n], enumerable: !(s = mi(e, n)) || s.enumerable });
        return t;
    };
var vi = (t, e, r) => (
        (r = t != null ? hi(gi(t)) : {}),
        hn(e || !t || !t.__esModule ? xt(r, 'default', { value: t, enumerable: !0 }) : r, t)
    ),
    wi = (t) => hn(xt({}, '__esModule', { value: !0 }), t);
var mt = _((k) => {
    'use strict';
    Object.defineProperty(k, '__esModule', { value: !0 });
    k.regexpCode =
        k.getEsmExportName =
        k.getProperty =
        k.safeStringify =
        k.stringify =
        k.strConcat =
        k.addCodeArg =
        k.str =
        k._ =
        k.nil =
        k._Code =
        k.Name =
        k.IDENTIFIER =
        k._CodeOrName =
            void 0;
    var pt = class {};
    k._CodeOrName = pt;
    k.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Me = class extends pt {
        constructor(e) {
            if ((super(), !k.IDENTIFIER.test(e))) throw new Error('CodeGen: name must be a valid identifier');
            this.str = e;
        }
        toString() {
            return this.str;
        }
        emptyStr() {
            return !1;
        }
        get names() {
            return { [this.str]: 1 };
        }
    };
    k.Name = Me;
    var re = class extends pt {
        constructor(e) {
            super(), (this._items = typeof e == 'string' ? [e] : e);
        }
        toString() {
            return this.str;
        }
        emptyStr() {
            if (this._items.length > 1) return !1;
            let e = this._items[0];
            return e === '' || e === '""';
        }
        get str() {
            var e;
            return (e = this._str) !== null && e !== void 0
                ? e
                : (this._str = this._items.reduce((r, s) => `${r}${s}`, ''));
        }
        get names() {
            var e;
            return (e = this._names) !== null && e !== void 0
                ? e
                : (this._names = this._items.reduce(
                      (r, s) => (s instanceof Me && (r[s.str] = (r[s.str] || 0) + 1), r),
                      {},
                  ));
        }
    };
    k._Code = re;
    k.nil = new re('');
    function Tn(t, ...e) {
        let r = [t[0]],
            s = 0;
        for (; s < e.length; ) Ir(r, e[s]), r.push(t[++s]);
        return new re(r);
    }
    k._ = Tn;
    var Tr = new re('+');
    function In(t, ...e) {
        let r = [ht(t[0])],
            s = 0;
        for (; s < e.length; ) r.push(Tr), Ir(r, e[s]), r.push(Tr, ht(t[++s]));
        return xi(r), new re(r);
    }
    k.str = In;
    function Ir(t, e) {
        e instanceof re ? t.push(...e._items) : e instanceof Me ? t.push(e) : t.push(Fi(e));
    }
    k.addCodeArg = Ir;
    function xi(t) {
        let e = 1;
        for (; e < t.length - 1; ) {
            if (t[e] === Tr) {
                let r = Li(t[e - 1], t[e + 1]);
                if (r !== void 0) {
                    t.splice(e - 1, 3, r);
                    continue;
                }
                t[e++] = '+';
            }
            e++;
        }
    }
    function Li(t, e) {
        if (e === '""') return t;
        if (t === '""') return e;
        if (typeof t == 'string')
            return e instanceof Me || t[t.length - 1] !== '"'
                ? void 0
                : typeof e != 'string'
                  ? `${t.slice(0, -1)}${e}"`
                  : e[0] === '"'
                    ? t.slice(0, -1) + e.slice(1)
                    : void 0;
        if (typeof e == 'string' && e[0] === '"' && !(t instanceof Me)) return `"${t}${e.slice(1)}`;
    }
    function zi(t, e) {
        return e.emptyStr() ? t : t.emptyStr() ? e : In`${t}${e}`;
    }
    k.strConcat = zi;
    function Fi(t) {
        return typeof t == 'number' || typeof t == 'boolean' || t === null ? t : ht(Array.isArray(t) ? t.join(',') : t);
    }
    function Gi(t) {
        return new re(ht(t));
    }
    k.stringify = Gi;
    function ht(t) {
        return JSON.stringify(t)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
    }
    k.safeStringify = ht;
    function Hi(t) {
        return typeof t == 'string' && k.IDENTIFIER.test(t) ? new re(`.${t}`) : Tn`[${t}]`;
    }
    k.getProperty = Hi;
    function Bi(t) {
        if (typeof t == 'string' && k.IDENTIFIER.test(t)) return new re(`${t}`);
        throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`);
    }
    k.getEsmExportName = Bi;
    function Ji(t) {
        return new re(t.toString());
    }
    k.regexpCode = Ji;
});
var qr = _((X) => {
    'use strict';
    Object.defineProperty(X, '__esModule', { value: !0 });
    X.ValueScope = X.ValueScopeName = X.Scope = X.varKinds = X.UsedValueState = void 0;
    var Q = mt(),
        kr = class extends Error {
            constructor(e) {
                super(`CodeGen: "code" for ${e} not defined`), (this.value = e.value);
            }
        },
        Ht;
    (function (t) {
        (t[(t.Started = 0)] = 'Started'), (t[(t.Completed = 1)] = 'Completed');
    })(Ht || (X.UsedValueState = Ht = {}));
    X.varKinds = { const: new Q.Name('const'), let: new Q.Name('let'), var: new Q.Name('var') };
    var Bt = class {
        constructor({ prefixes: e, parent: r } = {}) {
            (this._names = {}), (this._prefixes = e), (this._parent = r);
        }
        toName(e) {
            return e instanceof Q.Name ? e : this.name(e);
        }
        name(e) {
            return new Q.Name(this._newName(e));
        }
        _newName(e) {
            let r = this._names[e] || this._nameGroup(e);
            return `${e}${r.index++}`;
        }
        _nameGroup(e) {
            var r, s;
            if (
                (!((s = (r = this._parent) === null || r === void 0 ? void 0 : r._prefixes) === null || s === void 0) &&
                    s.has(e)) ||
                (this._prefixes && !this._prefixes.has(e))
            )
                throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);
            return (this._names[e] = { prefix: e, index: 0 });
        }
    };
    X.Scope = Bt;
    var Jt = class extends Q.Name {
        constructor(e, r) {
            super(r), (this.prefix = e);
        }
        setValue(e, { property: r, itemIndex: s }) {
            (this.value = e), (this.scopePath = (0, Q._)`.${new Q.Name(r)}[${s}]`);
        }
    };
    X.ValueScopeName = Jt;
    var Wi = (0, Q._)`\n`,
        Cr = class extends Bt {
            constructor(e) {
                super(e),
                    (this._values = {}),
                    (this._scope = e.scope),
                    (this.opts = { ...e, _n: e.lines ? Wi : Q.nil });
            }
            get() {
                return this._scope;
            }
            name(e) {
                return new Jt(e, this._newName(e));
            }
            value(e, r) {
                var s;
                if (r.ref === void 0) throw new Error('CodeGen: ref must be passed in value');
                let n = this.toName(e),
                    { prefix: o } = n,
                    a = (s = r.key) !== null && s !== void 0 ? s : r.ref,
                    i = this._values[o];
                if (i) {
                    let c = i.get(a);
                    if (c) return c;
                } else i = this._values[o] = new Map();
                i.set(a, n);
                let l = this._scope[o] || (this._scope[o] = []),
                    u = l.length;
                return (l[u] = r.ref), n.setValue(r, { property: o, itemIndex: u }), n;
            }
            getValue(e, r) {
                let s = this._values[e];
                if (s) return s.get(r);
            }
            scopeRefs(e, r = this._values) {
                return this._reduceValues(r, (s) => {
                    if (s.scopePath === void 0) throw new Error(`CodeGen: name "${s}" has no value`);
                    return (0, Q._)`${e}${s.scopePath}`;
                });
            }
            scopeCode(e = this._values, r, s) {
                return this._reduceValues(
                    e,
                    (n) => {
                        if (n.value === void 0) throw new Error(`CodeGen: name "${n}" has no value`);
                        return n.value.code;
                    },
                    r,
                    s,
                );
            }
            _reduceValues(e, r, s = {}, n) {
                let o = Q.nil;
                for (let a in e) {
                    let i = e[a];
                    if (!i) continue;
                    let l = (s[a] = s[a] || new Map());
                    i.forEach((u) => {
                        if (l.has(u)) return;
                        l.set(u, Ht.Started);
                        let c = r(u);
                        if (c) {
                            let d = this.opts.es5 ? X.varKinds.var : X.varKinds.const;
                            o = (0, Q._)`${o}${d} ${u} = ${c};${this.opts._n}`;
                        } else if ((c = n?.(u))) o = (0, Q._)`${o}${c}${this.opts._n}`;
                        else throw new kr(u);
                        l.set(u, Ht.Completed);
                    });
                }
                return o;
            }
        };
    X.ValueScope = Cr;
});
var O = _((N) => {
    'use strict';
    Object.defineProperty(N, '__esModule', { value: !0 });
    N.or =
        N.and =
        N.not =
        N.CodeGen =
        N.operators =
        N.varKinds =
        N.ValueScopeName =
        N.ValueScope =
        N.Scope =
        N.Name =
        N.regexpCode =
        N.stringify =
        N.getProperty =
        N.nil =
        N.strConcat =
        N.str =
        N._ =
            void 0;
    var T = mt(),
        ae = qr(),
        Oe = mt();
    Object.defineProperty(N, '_', {
        enumerable: !0,
        get: function () {
            return Oe._;
        },
    });
    Object.defineProperty(N, 'str', {
        enumerable: !0,
        get: function () {
            return Oe.str;
        },
    });
    Object.defineProperty(N, 'strConcat', {
        enumerable: !0,
        get: function () {
            return Oe.strConcat;
        },
    });
    Object.defineProperty(N, 'nil', {
        enumerable: !0,
        get: function () {
            return Oe.nil;
        },
    });
    Object.defineProperty(N, 'getProperty', {
        enumerable: !0,
        get: function () {
            return Oe.getProperty;
        },
    });
    Object.defineProperty(N, 'stringify', {
        enumerable: !0,
        get: function () {
            return Oe.stringify;
        },
    });
    Object.defineProperty(N, 'regexpCode', {
        enumerable: !0,
        get: function () {
            return Oe.regexpCode;
        },
    });
    Object.defineProperty(N, 'Name', {
        enumerable: !0,
        get: function () {
            return Oe.Name;
        },
    });
    var Xt = qr();
    Object.defineProperty(N, 'Scope', {
        enumerable: !0,
        get: function () {
            return Xt.Scope;
        },
    });
    Object.defineProperty(N, 'ValueScope', {
        enumerable: !0,
        get: function () {
            return Xt.ValueScope;
        },
    });
    Object.defineProperty(N, 'ValueScopeName', {
        enumerable: !0,
        get: function () {
            return Xt.ValueScopeName;
        },
    });
    Object.defineProperty(N, 'varKinds', {
        enumerable: !0,
        get: function () {
            return Xt.varKinds;
        },
    });
    N.operators = {
        GT: new T._Code('>'),
        GTE: new T._Code('>='),
        LT: new T._Code('<'),
        LTE: new T._Code('<='),
        EQ: new T._Code('==='),
        NEQ: new T._Code('!=='),
        NOT: new T._Code('!'),
        OR: new T._Code('||'),
        AND: new T._Code('&&'),
        ADD: new T._Code('+'),
    };
    var $e = class {
            optimizeNodes() {
                return this;
            }
            optimizeNames(e, r) {
                return this;
            }
        },
        jr = class extends $e {
            constructor(e, r, s) {
                super(), (this.varKind = e), (this.name = r), (this.rhs = s);
            }
            render({ es5: e, _n: r }) {
                let s = e ? ae.varKinds.var : this.varKind,
                    n = this.rhs === void 0 ? '' : ` = ${this.rhs}`;
                return `${s} ${this.name}${n};${r}`;
            }
            optimizeNames(e, r) {
                if (e[this.name.str]) return this.rhs && (this.rhs = Ye(this.rhs, e, r)), this;
            }
            get names() {
                return this.rhs instanceof T._CodeOrName ? this.rhs.names : {};
            }
        },
        Wt = class extends $e {
            constructor(e, r, s) {
                super(), (this.lhs = e), (this.rhs = r), (this.sideEffects = s);
            }
            render({ _n: e }) {
                return `${this.lhs} = ${this.rhs};${e}`;
            }
            optimizeNames(e, r) {
                if (!(this.lhs instanceof T.Name && !e[this.lhs.str] && !this.sideEffects))
                    return (this.rhs = Ye(this.rhs, e, r)), this;
            }
            get names() {
                let e = this.lhs instanceof T.Name ? {} : { ...this.lhs.names };
                return Qt(e, this.rhs);
            }
        },
        Ar = class extends Wt {
            constructor(e, r, s, n) {
                super(e, s, n), (this.op = r);
            }
            render({ _n: e }) {
                return `${this.lhs} ${this.op}= ${this.rhs};${e}`;
            }
        },
        Mr = class extends $e {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `${this.label}:${e}`;
            }
        },
        Dr = class extends $e {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `break${this.label ? ` ${this.label}` : ''};${e}`;
            }
        },
        Ur = class extends $e {
            constructor(e) {
                super(), (this.error = e);
            }
            render({ _n: e }) {
                return `throw ${this.error};${e}`;
            }
            get names() {
                return this.error.names;
            }
        },
        Vr = class extends $e {
            constructor(e) {
                super(), (this.code = e);
            }
            render({ _n: e }) {
                return `${this.code};${e}`;
            }
            optimizeNodes() {
                return `${this.code}` ? this : void 0;
            }
            optimizeNames(e, r) {
                return (this.code = Ye(this.code, e, r)), this;
            }
            get names() {
                return this.code instanceof T._CodeOrName ? this.code.names : {};
            }
        },
        yt = class extends $e {
            constructor(e = []) {
                super(), (this.nodes = e);
            }
            render(e) {
                return this.nodes.reduce((r, s) => r + s.render(e), '');
            }
            optimizeNodes() {
                let { nodes: e } = this,
                    r = e.length;
                for (; r--; ) {
                    let s = e[r].optimizeNodes();
                    Array.isArray(s) ? e.splice(r, 1, ...s) : s ? (e[r] = s) : e.splice(r, 1);
                }
                return e.length > 0 ? this : void 0;
            }
            optimizeNames(e, r) {
                let { nodes: s } = this,
                    n = s.length;
                for (; n--; ) {
                    let o = s[n];
                    o.optimizeNames(e, r) || (Yi(e, o.names), s.splice(n, 1));
                }
                return s.length > 0 ? this : void 0;
            }
            get names() {
                return this.nodes.reduce((e, r) => Ve(e, r.names), {});
            }
        },
        ve = class extends yt {
            render(e) {
                return `{${e._n}${super.render(e)}}${e._n}`;
            }
        },
        Kr = class extends yt {},
        We = class extends ve {};
    We.kind = 'else';
    var De = class t extends ve {
        constructor(e, r) {
            super(r), (this.condition = e);
        }
        render(e) {
            let r = `if(${this.condition})${super.render(e)}`;
            return this.else && (r += `else ${this.else.render(e)}`), r;
        }
        optimizeNodes() {
            super.optimizeNodes();
            let e = this.condition;
            if (e === !0) return this.nodes;
            let r = this.else;
            if (r) {
                let s = r.optimizeNodes();
                r = this.else = Array.isArray(s) ? new We(s) : s;
            }
            if (r)
                return e === !1
                    ? r instanceof t
                        ? r
                        : r.nodes
                    : this.nodes.length
                      ? this
                      : new t(kn(e), r instanceof t ? [r] : r.nodes);
            if (!(e === !1 || !this.nodes.length)) return this;
        }
        optimizeNames(e, r) {
            var s;
            if (
                ((this.else = (s = this.else) === null || s === void 0 ? void 0 : s.optimizeNames(e, r)),
                !!(super.optimizeNames(e, r) || this.else))
            )
                return (this.condition = Ye(this.condition, e, r)), this;
        }
        get names() {
            let e = super.names;
            return Qt(e, this.condition), this.else && Ve(e, this.else.names), e;
        }
    };
    De.kind = 'if';
    var Ue = class extends ve {};
    Ue.kind = 'for';
    var xr = class extends Ue {
            constructor(e) {
                super(), (this.iteration = e);
            }
            render(e) {
                return `for(${this.iteration})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iteration = Ye(this.iteration, e, r)), this;
            }
            get names() {
                return Ve(super.names, this.iteration.names);
            }
        },
        Lr = class extends Ue {
            constructor(e, r, s, n) {
                super(), (this.varKind = e), (this.name = r), (this.from = s), (this.to = n);
            }
            render(e) {
                let r = e.es5 ? ae.varKinds.var : this.varKind,
                    { name: s, from: n, to: o } = this;
                return `for(${r} ${s}=${n}; ${s}<${o}; ${s}++)${super.render(e)}`;
            }
            get names() {
                let e = Qt(super.names, this.from);
                return Qt(e, this.to);
            }
        },
        Yt = class extends Ue {
            constructor(e, r, s, n) {
                super(), (this.loop = e), (this.varKind = r), (this.name = s), (this.iterable = n);
            }
            render(e) {
                return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iterable = Ye(this.iterable, e, r)), this;
            }
            get names() {
                return Ve(super.names, this.iterable.names);
            }
        },
        gt = class extends ve {
            constructor(e, r, s) {
                super(), (this.name = e), (this.args = r), (this.async = s);
            }
            render(e) {
                return `${this.async ? 'async ' : ''}function ${this.name}(${this.args})${super.render(e)}`;
            }
        };
    gt.kind = 'func';
    var _t = class extends yt {
        render(e) {
            return `return ${super.render(e)}`;
        }
    };
    _t.kind = 'return';
    var zr = class extends ve {
            render(e) {
                let r = `try${super.render(e)}`;
                return this.catch && (r += this.catch.render(e)), this.finally && (r += this.finally.render(e)), r;
            }
            optimizeNodes() {
                var e, r;
                return (
                    super.optimizeNodes(),
                    (e = this.catch) === null || e === void 0 || e.optimizeNodes(),
                    (r = this.finally) === null || r === void 0 || r.optimizeNodes(),
                    this
                );
            }
            optimizeNames(e, r) {
                var s, n;
                return (
                    super.optimizeNames(e, r),
                    (s = this.catch) === null || s === void 0 || s.optimizeNames(e, r),
                    (n = this.finally) === null || n === void 0 || n.optimizeNames(e, r),
                    this
                );
            }
            get names() {
                let e = super.names;
                return this.catch && Ve(e, this.catch.names), this.finally && Ve(e, this.finally.names), e;
            }
        },
        $t = class extends ve {
            constructor(e) {
                super(), (this.error = e);
            }
            render(e) {
                return `catch(${this.error})${super.render(e)}`;
            }
        };
    $t.kind = 'catch';
    var vt = class extends ve {
        render(e) {
            return `finally${super.render(e)}`;
        }
    };
    vt.kind = 'finally';
    var Fr = class {
        constructor(e, r = {}) {
            (this._values = {}),
                (this._blockStarts = []),
                (this._constants = {}),
                (this.opts = {
                    ...r,
                    _n: r.lines
                        ? `
`
                        : '',
                }),
                (this._extScope = e),
                (this._scope = new ae.Scope({ parent: e })),
                (this._nodes = [new Kr()]);
        }
        toString() {
            return this._root.render(this.opts);
        }
        name(e) {
            return this._scope.name(e);
        }
        scopeName(e) {
            return this._extScope.name(e);
        }
        scopeValue(e, r) {
            let s = this._extScope.value(e, r);
            return (this._values[s.prefix] || (this._values[s.prefix] = new Set())).add(s), s;
        }
        getScopeValue(e, r) {
            return this._extScope.getValue(e, r);
        }
        scopeRefs(e) {
            return this._extScope.scopeRefs(e, this._values);
        }
        scopeCode() {
            return this._extScope.scopeCode(this._values);
        }
        _def(e, r, s, n) {
            let o = this._scope.toName(r);
            return s !== void 0 && n && (this._constants[o.str] = s), this._leafNode(new jr(e, o, s)), o;
        }
        const(e, r, s) {
            return this._def(ae.varKinds.const, e, r, s);
        }
        let(e, r, s) {
            return this._def(ae.varKinds.let, e, r, s);
        }
        var(e, r, s) {
            return this._def(ae.varKinds.var, e, r, s);
        }
        assign(e, r, s) {
            return this._leafNode(new Wt(e, r, s));
        }
        add(e, r) {
            return this._leafNode(new Ar(e, N.operators.ADD, r));
        }
        code(e) {
            return typeof e == 'function' ? e() : e !== T.nil && this._leafNode(new Vr(e)), this;
        }
        object(...e) {
            let r = ['{'];
            for (let [s, n] of e)
                r.length > 1 && r.push(','),
                    r.push(s),
                    (s !== n || this.opts.es5) && (r.push(':'), (0, T.addCodeArg)(r, n));
            return r.push('}'), new T._Code(r);
        }
        if(e, r, s) {
            if ((this._blockNode(new De(e)), r && s)) this.code(r).else().code(s).endIf();
            else if (r) this.code(r).endIf();
            else if (s) throw new Error('CodeGen: "else" body without "then" body');
            return this;
        }
        elseIf(e) {
            return this._elseNode(new De(e));
        }
        else() {
            return this._elseNode(new We());
        }
        endIf() {
            return this._endBlockNode(De, We);
        }
        _for(e, r) {
            return this._blockNode(e), r && this.code(r).endFor(), this;
        }
        for(e, r) {
            return this._for(new xr(e), r);
        }
        forRange(e, r, s, n, o = this.opts.es5 ? ae.varKinds.var : ae.varKinds.let) {
            let a = this._scope.toName(e);
            return this._for(new Lr(o, a, r, s), () => n(a));
        }
        forOf(e, r, s, n = ae.varKinds.const) {
            let o = this._scope.toName(e);
            if (this.opts.es5) {
                let a = r instanceof T.Name ? r : this.var('_arr', r);
                return this.forRange('_i', 0, (0, T._)`${a}.length`, (i) => {
                    this.var(o, (0, T._)`${a}[${i}]`), s(o);
                });
            }
            return this._for(new Yt('of', n, o, r), () => s(o));
        }
        forIn(e, r, s, n = this.opts.es5 ? ae.varKinds.var : ae.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(e, (0, T._)`Object.keys(${r})`, s);
            let o = this._scope.toName(e);
            return this._for(new Yt('in', n, o, r), () => s(o));
        }
        endFor() {
            return this._endBlockNode(Ue);
        }
        label(e) {
            return this._leafNode(new Mr(e));
        }
        break(e) {
            return this._leafNode(new Dr(e));
        }
        return(e) {
            let r = new _t();
            if ((this._blockNode(r), this.code(e), r.nodes.length !== 1))
                throw new Error('CodeGen: "return" should have one node');
            return this._endBlockNode(_t);
        }
        try(e, r, s) {
            if (!r && !s) throw new Error('CodeGen: "try" without "catch" and "finally"');
            let n = new zr();
            if ((this._blockNode(n), this.code(e), r)) {
                let o = this.name('e');
                (this._currNode = n.catch = new $t(o)), r(o);
            }
            return s && ((this._currNode = n.finally = new vt()), this.code(s)), this._endBlockNode($t, vt);
        }
        throw(e) {
            return this._leafNode(new Ur(e));
        }
        block(e, r) {
            return this._blockStarts.push(this._nodes.length), e && this.code(e).endBlock(r), this;
        }
        endBlock(e) {
            let r = this._blockStarts.pop();
            if (r === void 0) throw new Error('CodeGen: not in self-balancing block');
            let s = this._nodes.length - r;
            if (s < 0 || (e !== void 0 && s !== e))
                throw new Error(`CodeGen: wrong number of nodes: ${s} vs ${e} expected`);
            return (this._nodes.length = r), this;
        }
        func(e, r = T.nil, s, n) {
            return this._blockNode(new gt(e, r, s)), n && this.code(n).endFunc(), this;
        }
        endFunc() {
            return this._endBlockNode(gt);
        }
        optimize(e = 1) {
            for (; e-- > 0; ) this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
        }
        _leafNode(e) {
            return this._currNode.nodes.push(e), this;
        }
        _blockNode(e) {
            this._currNode.nodes.push(e), this._nodes.push(e);
        }
        _endBlockNode(e, r) {
            let s = this._currNode;
            if (s instanceof e || (r && s instanceof r)) return this._nodes.pop(), this;
            throw new Error(`CodeGen: not in block "${r ? `${e.kind}/${r.kind}` : e.kind}"`);
        }
        _elseNode(e) {
            let r = this._currNode;
            if (!(r instanceof De)) throw new Error('CodeGen: "else" without "if"');
            return (this._currNode = r.else = e), this;
        }
        get _root() {
            return this._nodes[0];
        }
        get _currNode() {
            let e = this._nodes;
            return e[e.length - 1];
        }
        set _currNode(e) {
            let r = this._nodes;
            r[r.length - 1] = e;
        }
    };
    N.CodeGen = Fr;
    function Ve(t, e) {
        for (let r in e) t[r] = (t[r] || 0) + (e[r] || 0);
        return t;
    }
    function Qt(t, e) {
        return e instanceof T._CodeOrName ? Ve(t, e.names) : t;
    }
    function Ye(t, e, r) {
        if (t instanceof T.Name) return s(t);
        if (!n(t)) return t;
        return new T._Code(
            t._items.reduce(
                (o, a) => (
                    a instanceof T.Name && (a = s(a)), a instanceof T._Code ? o.push(...a._items) : o.push(a), o
                ),
                [],
            ),
        );
        function s(o) {
            let a = r[o.str];
            return a === void 0 || e[o.str] !== 1 ? o : (delete e[o.str], a);
        }
        function n(o) {
            return (
                o instanceof T._Code &&
                o._items.some((a) => a instanceof T.Name && e[a.str] === 1 && r[a.str] !== void 0)
            );
        }
    }
    function Yi(t, e) {
        for (let r in e) t[r] = (t[r] || 0) - (e[r] || 0);
    }
    function kn(t) {
        return typeof t == 'boolean' || typeof t == 'number' || t === null ? !t : (0, T._)`!${Gr(t)}`;
    }
    N.not = kn;
    var Qi = Cn(N.operators.AND);
    function Xi(...t) {
        return t.reduce(Qi);
    }
    N.and = Xi;
    var Zi = Cn(N.operators.OR);
    function ec(...t) {
        return t.reduce(Zi);
    }
    N.or = ec;
    function Cn(t) {
        return (e, r) => (e === T.nil ? r : r === T.nil ? e : (0, T._)`${Gr(e)} ${t} ${Gr(r)}`);
    }
    function Gr(t) {
        return t instanceof T.Name ? t : (0, T._)`(${t})`;
    }
});
var C = _((R) => {
    'use strict';
    Object.defineProperty(R, '__esModule', { value: !0 });
    R.checkStrictMode =
        R.getErrorPath =
        R.Type =
        R.useFunc =
        R.setEvaluated =
        R.evaluatedPropsToName =
        R.mergeEvaluated =
        R.eachItem =
        R.unescapeJsonPointer =
        R.escapeJsonPointer =
        R.escapeFragment =
        R.unescapeFragment =
        R.schemaRefOrVal =
        R.schemaHasRulesButRef =
        R.schemaHasRules =
        R.checkUnknownRules =
        R.alwaysValidSchema =
        R.toHash =
            void 0;
    var A = O(),
        tc = mt();
    function rc(t) {
        let e = {};
        for (let r of t) e[r] = !0;
        return e;
    }
    R.toHash = rc;
    function sc(t, e) {
        return typeof e == 'boolean' ? e : Object.keys(e).length === 0 ? !0 : (An(t, e), !Mn(e, t.self.RULES.all));
    }
    R.alwaysValidSchema = sc;
    function An(t, e = t.schema) {
        let { opts: r, self: s } = t;
        if (!r.strictSchema || typeof e == 'boolean') return;
        let n = s.RULES.keywords;
        for (let o in e) n[o] || Vn(t, `unknown keyword: "${o}"`);
    }
    R.checkUnknownRules = An;
    function Mn(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e[r]) return !0;
        return !1;
    }
    R.schemaHasRules = Mn;
    function nc(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (r !== '$ref' && e.all[r]) return !0;
        return !1;
    }
    R.schemaHasRulesButRef = nc;
    function oc({ topSchemaRef: t, schemaPath: e }, r, s, n) {
        if (!n) {
            if (typeof r == 'number' || typeof r == 'boolean') return r;
            if (typeof r == 'string') return (0, A._)`${r}`;
        }
        return (0, A._)`${t}${e}${(0, A.getProperty)(s)}`;
    }
    R.schemaRefOrVal = oc;
    function ac(t) {
        return Dn(decodeURIComponent(t));
    }
    R.unescapeFragment = ac;
    function ic(t) {
        return encodeURIComponent(Br(t));
    }
    R.escapeFragment = ic;
    function Br(t) {
        return typeof t == 'number' ? `${t}` : t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
    R.escapeJsonPointer = Br;
    function Dn(t) {
        return t.replace(/~1/g, '/').replace(/~0/g, '~');
    }
    R.unescapeJsonPointer = Dn;
    function cc(t, e) {
        if (Array.isArray(t)) for (let r of t) e(r);
        else e(t);
    }
    R.eachItem = cc;
    function qn({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: s }) {
        return (n, o, a, i) => {
            let l =
                a === void 0
                    ? o
                    : a instanceof A.Name
                      ? (o instanceof A.Name ? t(n, o, a) : e(n, o, a), a)
                      : o instanceof A.Name
                        ? (e(n, a, o), o)
                        : r(o, a);
            return i === A.Name && !(l instanceof A.Name) ? s(n, l) : l;
        };
    }
    R.mergeEvaluated = {
        props: qn({
            mergeNames: (t, e, r) =>
                t.if((0, A._)`${r} !== true && ${e} !== undefined`, () => {
                    t.if(
                        (0, A._)`${e} === true`,
                        () => t.assign(r, !0),
                        () => t.assign(r, (0, A._)`${r} || {}`).code((0, A._)`Object.assign(${r}, ${e})`),
                    );
                }),
            mergeToName: (t, e, r) =>
                t.if((0, A._)`${r} !== true`, () => {
                    e === !0 ? t.assign(r, !0) : (t.assign(r, (0, A._)`${r} || {}`), Jr(t, r, e));
                }),
            mergeValues: (t, e) => (t === !0 ? !0 : { ...t, ...e }),
            resultToName: Un,
        }),
        items: qn({
            mergeNames: (t, e, r) =>
                t.if((0, A._)`${r} !== true && ${e} !== undefined`, () =>
                    t.assign(r, (0, A._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`),
                ),
            mergeToName: (t, e, r) =>
                t.if((0, A._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, A._)`${r} > ${e} ? ${r} : ${e}`)),
            mergeValues: (t, e) => (t === !0 ? !0 : Math.max(t, e)),
            resultToName: (t, e) => t.var('items', e),
        }),
    };
    function Un(t, e) {
        if (e === !0) return t.var('props', !0);
        let r = t.var('props', (0, A._)`{}`);
        return e !== void 0 && Jr(t, r, e), r;
    }
    R.evaluatedPropsToName = Un;
    function Jr(t, e, r) {
        Object.keys(r).forEach((s) => t.assign((0, A._)`${e}${(0, A.getProperty)(s)}`, !0));
    }
    R.setEvaluated = Jr;
    var jn = {};
    function uc(t, e) {
        return t.scopeValue('func', { ref: e, code: jn[e.code] || (jn[e.code] = new tc._Code(e.code)) });
    }
    R.useFunc = uc;
    var Hr;
    (function (t) {
        (t[(t.Num = 0)] = 'Num'), (t[(t.Str = 1)] = 'Str');
    })(Hr || (R.Type = Hr = {}));
    function lc(t, e, r) {
        if (t instanceof A.Name) {
            let s = e === Hr.Num;
            return r
                ? s
                    ? (0, A._)`"[" + ${t} + "]"`
                    : (0, A._)`"['" + ${t} + "']"`
                : s
                  ? (0, A._)`"/" + ${t}`
                  : (0, A._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
        }
        return r ? (0, A.getProperty)(t).toString() : `/${Br(t)}`;
    }
    R.getErrorPath = lc;
    function Vn(t, e, r = t.opts.strictSchema) {
        if (r) {
            if (((e = `strict mode: ${e}`), r === !0)) throw new Error(e);
            t.self.logger.warn(e);
        }
    }
    R.checkStrictMode = Vn;
});
var we = _((Wr) => {
    'use strict';
    Object.defineProperty(Wr, '__esModule', { value: !0 });
    var G = O(),
        dc = {
            data: new G.Name('data'),
            valCxt: new G.Name('valCxt'),
            instancePath: new G.Name('instancePath'),
            parentData: new G.Name('parentData'),
            parentDataProperty: new G.Name('parentDataProperty'),
            rootData: new G.Name('rootData'),
            dynamicAnchors: new G.Name('dynamicAnchors'),
            vErrors: new G.Name('vErrors'),
            errors: new G.Name('errors'),
            this: new G.Name('this'),
            self: new G.Name('self'),
            scope: new G.Name('scope'),
            json: new G.Name('json'),
            jsonPos: new G.Name('jsonPos'),
            jsonLen: new G.Name('jsonLen'),
            jsonPart: new G.Name('jsonPart'),
        };
    Wr.default = dc;
});
var wt = _((H) => {
    'use strict';
    Object.defineProperty(H, '__esModule', { value: !0 });
    H.extendErrors =
        H.resetErrorsCount =
        H.reportExtraError =
        H.reportError =
        H.keyword$DataError =
        H.keywordError =
            void 0;
    var I = O(),
        Zt = C(),
        W = we();
    H.keywordError = { message: ({ keyword: t }) => (0, I.str)`must pass "${t}" keyword validation` };
    H.keyword$DataError = {
        message: ({ keyword: t, schemaType: e }) =>
            e ? (0, I.str)`"${t}" keyword must be ${e} ($data)` : (0, I.str)`"${t}" keyword is invalid ($data)`,
    };
    function fc(t, e = H.keywordError, r, s) {
        let { it: n } = t,
            { gen: o, compositeRule: a, allErrors: i } = n,
            l = Ln(t, e, r);
        (s ?? (a || i)) ? Kn(o, l) : xn(n, (0, I._)`[${l}]`);
    }
    H.reportError = fc;
    function pc(t, e = H.keywordError, r) {
        let { it: s } = t,
            { gen: n, compositeRule: o, allErrors: a } = s,
            i = Ln(t, e, r);
        Kn(n, i), o || a || xn(s, W.default.vErrors);
    }
    H.reportExtraError = pc;
    function hc(t, e) {
        t.assign(W.default.errors, e),
            t.if((0, I._)`${W.default.vErrors} !== null`, () =>
                t.if(
                    e,
                    () => t.assign((0, I._)`${W.default.vErrors}.length`, e),
                    () => t.assign(W.default.vErrors, null),
                ),
            );
    }
    H.resetErrorsCount = hc;
    function mc({ gen: t, keyword: e, schemaValue: r, data: s, errsCount: n, it: o }) {
        if (n === void 0) throw new Error('ajv implementation error');
        let a = t.name('err');
        t.forRange('i', n, W.default.errors, (i) => {
            t.const(a, (0, I._)`${W.default.vErrors}[${i}]`),
                t.if((0, I._)`${a}.instancePath === undefined`, () =>
                    t.assign((0, I._)`${a}.instancePath`, (0, I.strConcat)(W.default.instancePath, o.errorPath)),
                ),
                t.assign((0, I._)`${a}.schemaPath`, (0, I.str)`${o.errSchemaPath}/${e}`),
                o.opts.verbose && (t.assign((0, I._)`${a}.schema`, r), t.assign((0, I._)`${a}.data`, s));
        });
    }
    H.extendErrors = mc;
    function Kn(t, e) {
        let r = t.const('err', e);
        t.if(
            (0, I._)`${W.default.vErrors} === null`,
            () => t.assign(W.default.vErrors, (0, I._)`[${r}]`),
            (0, I._)`${W.default.vErrors}.push(${r})`,
        ),
            t.code((0, I._)`${W.default.errors}++`);
    }
    function xn(t, e) {
        let { gen: r, validateName: s, schemaEnv: n } = t;
        n.$async
            ? r.throw((0, I._)`new ${t.ValidationError}(${e})`)
            : (r.assign((0, I._)`${s}.errors`, e), r.return(!1));
    }
    var Ke = {
        keyword: new I.Name('keyword'),
        schemaPath: new I.Name('schemaPath'),
        params: new I.Name('params'),
        propertyName: new I.Name('propertyName'),
        message: new I.Name('message'),
        schema: new I.Name('schema'),
        parentSchema: new I.Name('parentSchema'),
    };
    function Ln(t, e, r) {
        let { createErrors: s } = t.it;
        return s === !1 ? (0, I._)`{}` : yc(t, e, r);
    }
    function yc(t, e, r = {}) {
        let { gen: s, it: n } = t,
            o = [gc(n, r), _c(t, r)];
        return $c(t, e, o), s.object(...o);
    }
    function gc({ errorPath: t }, { instancePath: e }) {
        let r = e ? (0, I.str)`${t}${(0, Zt.getErrorPath)(e, Zt.Type.Str)}` : t;
        return [W.default.instancePath, (0, I.strConcat)(W.default.instancePath, r)];
    }
    function _c({ keyword: t, it: { errSchemaPath: e } }, { schemaPath: r, parentSchema: s }) {
        let n = s ? e : (0, I.str)`${e}/${t}`;
        return r && (n = (0, I.str)`${n}${(0, Zt.getErrorPath)(r, Zt.Type.Str)}`), [Ke.schemaPath, n];
    }
    function $c(t, { params: e, message: r }, s) {
        let { keyword: n, data: o, schemaValue: a, it: i } = t,
            { opts: l, propertyName: u, topSchemaRef: c, schemaPath: d } = i;
        s.push([Ke.keyword, n], [Ke.params, typeof e == 'function' ? e(t) : e || (0, I._)`{}`]),
            l.messages && s.push([Ke.message, typeof r == 'function' ? r(t) : r]),
            l.verbose && s.push([Ke.schema, a], [Ke.parentSchema, (0, I._)`${c}${d}`], [W.default.data, o]),
            u && s.push([Ke.propertyName, u]);
    }
});
var Fn = _((Qe) => {
    'use strict';
    Object.defineProperty(Qe, '__esModule', { value: !0 });
    Qe.boolOrEmptySchema = Qe.topBoolOrEmptySchema = void 0;
    var vc = wt(),
        wc = O(),
        Ec = we(),
        bc = { message: 'boolean schema is false' };
    function Sc(t) {
        let { gen: e, schema: r, validateName: s } = t;
        r === !1
            ? zn(t, !1)
            : typeof r == 'object' && r.$async === !0
              ? e.return(Ec.default.data)
              : (e.assign((0, wc._)`${s}.errors`, null), e.return(!0));
    }
    Qe.topBoolOrEmptySchema = Sc;
    function Pc(t, e) {
        let { gen: r, schema: s } = t;
        s === !1 ? (r.var(e, !1), zn(t)) : r.var(e, !0);
    }
    Qe.boolOrEmptySchema = Pc;
    function zn(t, e) {
        let { gen: r, data: s } = t,
            n = {
                gen: r,
                keyword: 'false schema',
                data: s,
                schema: !1,
                schemaCode: !1,
                schemaValue: !1,
                params: {},
                it: t,
            };
        (0, vc.reportError)(n, bc, void 0, e);
    }
});
var Yr = _((Xe) => {
    'use strict';
    Object.defineProperty(Xe, '__esModule', { value: !0 });
    Xe.getRules = Xe.isJSONType = void 0;
    var Nc = ['string', 'number', 'integer', 'boolean', 'null', 'object', 'array'],
        Oc = new Set(Nc);
    function Rc(t) {
        return typeof t == 'string' && Oc.has(t);
    }
    Xe.isJSONType = Rc;
    function Tc() {
        let t = {
            number: { type: 'number', rules: [] },
            string: { type: 'string', rules: [] },
            array: { type: 'array', rules: [] },
            object: { type: 'object', rules: [] },
        };
        return {
            types: { ...t, integer: !0, boolean: !0, null: !0 },
            rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
            post: { rules: [] },
            all: {},
            keywords: {},
        };
    }
    Xe.getRules = Tc;
});
var Qr = _((Re) => {
    'use strict';
    Object.defineProperty(Re, '__esModule', { value: !0 });
    Re.shouldUseRule = Re.shouldUseGroup = Re.schemaHasRulesForType = void 0;
    function Ic({ schema: t, self: e }, r) {
        let s = e.RULES.types[r];
        return s && s !== !0 && Gn(t, s);
    }
    Re.schemaHasRulesForType = Ic;
    function Gn(t, e) {
        return e.rules.some((r) => Hn(t, r));
    }
    Re.shouldUseGroup = Gn;
    function Hn(t, e) {
        var r;
        return (
            t[e.keyword] !== void 0 ||
            ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((s) => t[s] !== void 0))
        );
    }
    Re.shouldUseRule = Hn;
});
var Et = _((B) => {
    'use strict';
    Object.defineProperty(B, '__esModule', { value: !0 });
    B.reportTypeError =
        B.checkDataTypes =
        B.checkDataType =
        B.coerceAndCheckDataType =
        B.getJSONTypes =
        B.getSchemaTypes =
        B.DataType =
            void 0;
    var kc = Yr(),
        Cc = Qr(),
        qc = wt(),
        P = O(),
        Bn = C(),
        Ze;
    (function (t) {
        (t[(t.Correct = 0)] = 'Correct'), (t[(t.Wrong = 1)] = 'Wrong');
    })(Ze || (B.DataType = Ze = {}));
    function jc(t) {
        let e = Jn(t.type);
        if (e.includes('null')) {
            if (t.nullable === !1) throw new Error('type: null contradicts nullable: false');
        } else {
            if (!e.length && t.nullable !== void 0) throw new Error('"nullable" cannot be used without "type"');
            t.nullable === !0 && e.push('null');
        }
        return e;
    }
    B.getSchemaTypes = jc;
    function Jn(t) {
        let e = Array.isArray(t) ? t : t ? [t] : [];
        if (e.every(kc.isJSONType)) return e;
        throw new Error(`type must be JSONType or JSONType[]: ${e.join(',')}`);
    }
    B.getJSONTypes = Jn;
    function Ac(t, e) {
        let { gen: r, data: s, opts: n } = t,
            o = Mc(e, n.coerceTypes),
            a = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, Cc.schemaHasRulesForType)(t, e[0]));
        if (a) {
            let i = Zr(e, s, n.strictNumbers, Ze.Wrong);
            r.if(i, () => {
                o.length ? Dc(t, e, o) : es(t);
            });
        }
        return a;
    }
    B.coerceAndCheckDataType = Ac;
    var Wn = new Set(['string', 'number', 'integer', 'boolean', 'null']);
    function Mc(t, e) {
        return e ? t.filter((r) => Wn.has(r) || (e === 'array' && r === 'array')) : [];
    }
    function Dc(t, e, r) {
        let { gen: s, data: n, opts: o } = t,
            a = s.let('dataType', (0, P._)`typeof ${n}`),
            i = s.let('coerced', (0, P._)`undefined`);
        o.coerceTypes === 'array' &&
            s.if((0, P._)`${a} == 'object' && Array.isArray(${n}) && ${n}.length == 1`, () =>
                s
                    .assign(n, (0, P._)`${n}[0]`)
                    .assign(a, (0, P._)`typeof ${n}`)
                    .if(Zr(e, n, o.strictNumbers), () => s.assign(i, n)),
            ),
            s.if((0, P._)`${i} !== undefined`);
        for (let u of r) (Wn.has(u) || (u === 'array' && o.coerceTypes === 'array')) && l(u);
        s.else(),
            es(t),
            s.endIf(),
            s.if((0, P._)`${i} !== undefined`, () => {
                s.assign(n, i), Uc(t, i);
            });
        function l(u) {
            switch (u) {
                case 'string':
                    s.elseIf((0, P._)`${a} == "number" || ${a} == "boolean"`)
                        .assign(i, (0, P._)`"" + ${n}`)
                        .elseIf((0, P._)`${n} === null`)
                        .assign(i, (0, P._)`""`);
                    return;
                case 'number':
                    s.elseIf(
                        (0, P._)`${a} == "boolean" || ${n} === null
              || (${a} == "string" && ${n} && ${n} == +${n})`,
                    ).assign(i, (0, P._)`+${n}`);
                    return;
                case 'integer':
                    s.elseIf(
                        (0, P._)`${a} === "boolean" || ${n} === null
              || (${a} === "string" && ${n} && ${n} == +${n} && !(${n} % 1))`,
                    ).assign(i, (0, P._)`+${n}`);
                    return;
                case 'boolean':
                    s.elseIf((0, P._)`${n} === "false" || ${n} === 0 || ${n} === null`)
                        .assign(i, !1)
                        .elseIf((0, P._)`${n} === "true" || ${n} === 1`)
                        .assign(i, !0);
                    return;
                case 'null':
                    s.elseIf((0, P._)`${n} === "" || ${n} === 0 || ${n} === false`), s.assign(i, null);
                    return;
                case 'array':
                    s.elseIf(
                        (0, P._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${n} === null`,
                    ).assign(i, (0, P._)`[${n}]`);
            }
        }
    }
    function Uc({ gen: t, parentData: e, parentDataProperty: r }, s) {
        t.if((0, P._)`${e} !== undefined`, () => t.assign((0, P._)`${e}[${r}]`, s));
    }
    function Xr(t, e, r, s = Ze.Correct) {
        let n = s === Ze.Correct ? P.operators.EQ : P.operators.NEQ,
            o;
        switch (t) {
            case 'null':
                return (0, P._)`${e} ${n} null`;
            case 'array':
                o = (0, P._)`Array.isArray(${e})`;
                break;
            case 'object':
                o = (0, P._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
                break;
            case 'integer':
                o = a((0, P._)`!(${e} % 1) && !isNaN(${e})`);
                break;
            case 'number':
                o = a();
                break;
            default:
                return (0, P._)`typeof ${e} ${n} ${t}`;
        }
        return s === Ze.Correct ? o : (0, P.not)(o);
        function a(i = P.nil) {
            return (0, P.and)((0, P._)`typeof ${e} == "number"`, i, r ? (0, P._)`isFinite(${e})` : P.nil);
        }
    }
    B.checkDataType = Xr;
    function Zr(t, e, r, s) {
        if (t.length === 1) return Xr(t[0], e, r, s);
        let n,
            o = (0, Bn.toHash)(t);
        if (o.array && o.object) {
            let a = (0, P._)`typeof ${e} != "object"`;
            (n = o.null ? a : (0, P._)`!${e} || ${a}`), delete o.null, delete o.array, delete o.object;
        } else n = P.nil;
        o.number && delete o.integer;
        for (let a in o) n = (0, P.and)(n, Xr(a, e, r, s));
        return n;
    }
    B.checkDataTypes = Zr;
    var Vc = {
        message: ({ schema: t }) => `must be ${t}`,
        params: ({ schema: t, schemaValue: e }) =>
            typeof t == 'string' ? (0, P._)`{type: ${t}}` : (0, P._)`{type: ${e}}`,
    };
    function es(t) {
        let e = Kc(t);
        (0, qc.reportError)(e, Vc);
    }
    B.reportTypeError = es;
    function Kc(t) {
        let { gen: e, data: r, schema: s } = t,
            n = (0, Bn.schemaRefOrVal)(t, s, 'type');
        return {
            gen: e,
            keyword: 'type',
            data: r,
            schema: s.type,
            schemaCode: n,
            schemaValue: n,
            parentSchema: s,
            params: {},
            it: t,
        };
    }
});
var Qn = _((er) => {
    'use strict';
    Object.defineProperty(er, '__esModule', { value: !0 });
    er.assignDefaults = void 0;
    var et = O(),
        xc = C();
    function Lc(t, e) {
        let { properties: r, items: s } = t.schema;
        if (e === 'object' && r) for (let n in r) Yn(t, n, r[n].default);
        else e === 'array' && Array.isArray(s) && s.forEach((n, o) => Yn(t, o, n.default));
    }
    er.assignDefaults = Lc;
    function Yn(t, e, r) {
        let { gen: s, compositeRule: n, data: o, opts: a } = t;
        if (r === void 0) return;
        let i = (0, et._)`${o}${(0, et.getProperty)(e)}`;
        if (n) {
            (0, xc.checkStrictMode)(t, `default is ignored for: ${i}`);
            return;
        }
        let l = (0, et._)`${i} === undefined`;
        a.useDefaults === 'empty' && (l = (0, et._)`${l} || ${i} === null || ${i} === ""`),
            s.if(l, (0, et._)`${i} = ${(0, et.stringify)(r)}`);
    }
});
var se = _((j) => {
    'use strict';
    Object.defineProperty(j, '__esModule', { value: !0 });
    j.validateUnion =
        j.validateArray =
        j.usePattern =
        j.callValidateCode =
        j.schemaProperties =
        j.allSchemaProperties =
        j.noPropertyInData =
        j.propertyInData =
        j.isOwnProperty =
        j.hasPropFunc =
        j.reportMissingProp =
        j.checkMissingProp =
        j.checkReportMissingProp =
            void 0;
    var M = O(),
        ts = C(),
        Te = we(),
        zc = C();
    function Fc(t, e) {
        let { gen: r, data: s, it: n } = t;
        r.if(ss(r, s, e, n.opts.ownProperties), () => {
            t.setParams({ missingProperty: (0, M._)`${e}` }, !0), t.error();
        });
    }
    j.checkReportMissingProp = Fc;
    function Gc({ gen: t, data: e, it: { opts: r } }, s, n) {
        return (0, M.or)(...s.map((o) => (0, M.and)(ss(t, e, o, r.ownProperties), (0, M._)`${n} = ${o}`)));
    }
    j.checkMissingProp = Gc;
    function Hc(t, e) {
        t.setParams({ missingProperty: e }, !0), t.error();
    }
    j.reportMissingProp = Hc;
    function Xn(t) {
        return t.scopeValue('func', {
            ref: Object.prototype.hasOwnProperty,
            code: (0, M._)`Object.prototype.hasOwnProperty`,
        });
    }
    j.hasPropFunc = Xn;
    function rs(t, e, r) {
        return (0, M._)`${Xn(t)}.call(${e}, ${r})`;
    }
    j.isOwnProperty = rs;
    function Bc(t, e, r, s) {
        let n = (0, M._)`${e}${(0, M.getProperty)(r)} !== undefined`;
        return s ? (0, M._)`${n} && ${rs(t, e, r)}` : n;
    }
    j.propertyInData = Bc;
    function ss(t, e, r, s) {
        let n = (0, M._)`${e}${(0, M.getProperty)(r)} === undefined`;
        return s ? (0, M.or)(n, (0, M.not)(rs(t, e, r))) : n;
    }
    j.noPropertyInData = ss;
    function Zn(t) {
        return t ? Object.keys(t).filter((e) => e !== '__proto__') : [];
    }
    j.allSchemaProperties = Zn;
    function Jc(t, e) {
        return Zn(e).filter((r) => !(0, ts.alwaysValidSchema)(t, e[r]));
    }
    j.schemaProperties = Jc;
    function Wc(
        { schemaCode: t, data: e, it: { gen: r, topSchemaRef: s, schemaPath: n, errorPath: o }, it: a },
        i,
        l,
        u,
    ) {
        let c = u ? (0, M._)`${t}, ${e}, ${s}${n}` : e,
            d = [
                [Te.default.instancePath, (0, M.strConcat)(Te.default.instancePath, o)],
                [Te.default.parentData, a.parentData],
                [Te.default.parentDataProperty, a.parentDataProperty],
                [Te.default.rootData, Te.default.rootData],
            ];
        a.opts.dynamicRef && d.push([Te.default.dynamicAnchors, Te.default.dynamicAnchors]);
        let h = (0, M._)`${c}, ${r.object(...d)}`;
        return l !== M.nil ? (0, M._)`${i}.call(${l}, ${h})` : (0, M._)`${i}(${h})`;
    }
    j.callValidateCode = Wc;
    var Yc = (0, M._)`new RegExp`;
    function Qc({ gen: t, it: { opts: e } }, r) {
        let s = e.unicodeRegExp ? 'u' : '',
            { regExp: n } = e.code,
            o = n(r, s);
        return t.scopeValue('pattern', {
            key: o.toString(),
            ref: o,
            code: (0, M._)`${n.code === 'new RegExp' ? Yc : (0, zc.useFunc)(t, n)}(${r}, ${s})`,
        });
    }
    j.usePattern = Qc;
    function Xc(t) {
        let { gen: e, data: r, keyword: s, it: n } = t,
            o = e.name('valid');
        if (n.allErrors) {
            let i = e.let('valid', !0);
            return a(() => e.assign(i, !1)), i;
        }
        return e.var(o, !0), a(() => e.break()), o;
        function a(i) {
            let l = e.const('len', (0, M._)`${r}.length`);
            e.forRange('i', 0, l, (u) => {
                t.subschema({ keyword: s, dataProp: u, dataPropType: ts.Type.Num }, o), e.if((0, M.not)(o), i);
            });
        }
    }
    j.validateArray = Xc;
    function Zc(t) {
        let { gen: e, schema: r, keyword: s, it: n } = t;
        if (!Array.isArray(r)) throw new Error('ajv implementation error');
        if (r.some((l) => (0, ts.alwaysValidSchema)(n, l)) && !n.opts.unevaluated) return;
        let a = e.let('valid', !1),
            i = e.name('_valid');
        e.block(() =>
            r.forEach((l, u) => {
                let c = t.subschema({ keyword: s, schemaProp: u, compositeRule: !0 }, i);
                e.assign(a, (0, M._)`${a} || ${i}`), t.mergeValidEvaluated(c, i) || e.if((0, M.not)(a));
            }),
        ),
            t.result(
                a,
                () => t.reset(),
                () => t.error(!0),
            );
    }
    j.validateUnion = Zc;
});
var ro = _((me) => {
    'use strict';
    Object.defineProperty(me, '__esModule', { value: !0 });
    me.validateKeywordUsage = me.validSchemaType = me.funcKeywordCode = me.macroKeywordCode = void 0;
    var Y = O(),
        xe = we(),
        eu = se(),
        tu = wt();
    function ru(t, e) {
        let { gen: r, keyword: s, schema: n, parentSchema: o, it: a } = t,
            i = e.macro.call(a.self, n, o, a),
            l = to(r, s, i);
        a.opts.validateSchema !== !1 && a.self.validateSchema(i, !0);
        let u = r.name('valid');
        t.subschema(
            {
                schema: i,
                schemaPath: Y.nil,
                errSchemaPath: `${a.errSchemaPath}/${s}`,
                topSchemaRef: l,
                compositeRule: !0,
            },
            u,
        ),
            t.pass(u, () => t.error(!0));
    }
    me.macroKeywordCode = ru;
    function su(t, e) {
        var r;
        let { gen: s, keyword: n, schema: o, parentSchema: a, $data: i, it: l } = t;
        ou(l, e);
        let u = !i && e.compile ? e.compile.call(l.self, o, a, l) : e.validate,
            c = to(s, n, u),
            d = s.let('valid');
        t.block$data(d, h), t.ok((r = e.valid) !== null && r !== void 0 ? r : d);
        function h() {
            if (e.errors === !1) p(), e.modifying && eo(t), y(() => t.error());
            else {
                let g = e.async ? m() : f();
                e.modifying && eo(t), y(() => nu(t, g));
            }
        }
        function m() {
            let g = s.let('ruleErrs', null);
            return (
                s.try(
                    () => p((0, Y._)`await `),
                    ($) =>
                        s.assign(d, !1).if(
                            (0, Y._)`${$} instanceof ${l.ValidationError}`,
                            () => s.assign(g, (0, Y._)`${$}.errors`),
                            () => s.throw($),
                        ),
                ),
                g
            );
        }
        function f() {
            let g = (0, Y._)`${c}.errors`;
            return s.assign(g, null), p(Y.nil), g;
        }
        function p(g = e.async ? (0, Y._)`await ` : Y.nil) {
            let $ = l.opts.passContext ? xe.default.this : xe.default.self,
                w = !(('compile' in e && !i) || e.schema === !1);
            s.assign(d, (0, Y._)`${g}${(0, eu.callValidateCode)(t, c, $, w)}`, e.modifying);
        }
        function y(g) {
            var $;
            s.if((0, Y.not)(($ = e.valid) !== null && $ !== void 0 ? $ : d), g);
        }
    }
    me.funcKeywordCode = su;
    function eo(t) {
        let { gen: e, data: r, it: s } = t;
        e.if(s.parentData, () => e.assign(r, (0, Y._)`${s.parentData}[${s.parentDataProperty}]`));
    }
    function nu(t, e) {
        let { gen: r } = t;
        r.if(
            (0, Y._)`Array.isArray(${e})`,
            () => {
                r
                    .assign(
                        xe.default.vErrors,
                        (0, Y._)`${xe.default.vErrors} === null ? ${e} : ${xe.default.vErrors}.concat(${e})`,
                    )
                    .assign(xe.default.errors, (0, Y._)`${xe.default.vErrors}.length`),
                    (0, tu.extendErrors)(t);
            },
            () => t.error(),
        );
    }
    function ou({ schemaEnv: t }, e) {
        if (e.async && !t.$async) throw new Error('async keyword in sync schema');
    }
    function to(t, e, r) {
        if (r === void 0) throw new Error(`keyword "${e}" failed to compile`);
        return t.scopeValue('keyword', typeof r == 'function' ? { ref: r } : { ref: r, code: (0, Y.stringify)(r) });
    }
    function au(t, e, r = !1) {
        return (
            !e.length ||
            e.some((s) =>
                s === 'array'
                    ? Array.isArray(t)
                    : s === 'object'
                      ? t && typeof t == 'object' && !Array.isArray(t)
                      : typeof t == s || (r && typeof t > 'u'),
            )
        );
    }
    me.validSchemaType = au;
    function iu({ schema: t, opts: e, self: r, errSchemaPath: s }, n, o) {
        if (Array.isArray(n.keyword) ? !n.keyword.includes(o) : n.keyword !== o)
            throw new Error('ajv implementation error');
        let a = n.dependencies;
        if (a?.some((i) => !Object.prototype.hasOwnProperty.call(t, i)))
            throw new Error(`parent schema must have dependencies of ${o}: ${a.join(',')}`);
        if (n.validateSchema && !n.validateSchema(t[o])) {
            let l = `keyword "${o}" value is invalid at path "${s}": ${r.errorsText(n.validateSchema.errors)}`;
            if (e.validateSchema === 'log') r.logger.error(l);
            else throw new Error(l);
        }
    }
    me.validateKeywordUsage = iu;
});
var no = _((Ie) => {
    'use strict';
    Object.defineProperty(Ie, '__esModule', { value: !0 });
    Ie.extendSubschemaMode = Ie.extendSubschemaData = Ie.getSubschema = void 0;
    var ye = O(),
        so = C();
    function cu(t, { keyword: e, schemaProp: r, schema: s, schemaPath: n, errSchemaPath: o, topSchemaRef: a }) {
        if (e !== void 0 && s !== void 0) throw new Error('both "keyword" and "schema" passed, only one allowed');
        if (e !== void 0) {
            let i = t.schema[e];
            return r === void 0
                ? {
                      schema: i,
                      schemaPath: (0, ye._)`${t.schemaPath}${(0, ye.getProperty)(e)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}`,
                  }
                : {
                      schema: i[r],
                      schemaPath: (0, ye._)`${t.schemaPath}${(0, ye.getProperty)(e)}${(0, ye.getProperty)(r)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, so.escapeFragment)(r)}`,
                  };
        }
        if (s !== void 0) {
            if (n === void 0 || o === void 0 || a === void 0)
                throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return { schema: s, schemaPath: n, topSchemaRef: a, errSchemaPath: o };
        }
        throw new Error('either "keyword" or "schema" must be passed');
    }
    Ie.getSubschema = cu;
    function uu(t, e, { dataProp: r, dataPropType: s, data: n, dataTypes: o, propertyName: a }) {
        if (n !== void 0 && r !== void 0) throw new Error('both "data" and "dataProp" passed, only one allowed');
        let { gen: i } = e;
        if (r !== void 0) {
            let { errorPath: u, dataPathArr: c, opts: d } = e,
                h = i.let('data', (0, ye._)`${e.data}${(0, ye.getProperty)(r)}`, !0);
            l(h),
                (t.errorPath = (0, ye.str)`${u}${(0, so.getErrorPath)(r, s, d.jsPropertySyntax)}`),
                (t.parentDataProperty = (0, ye._)`${r}`),
                (t.dataPathArr = [...c, t.parentDataProperty]);
        }
        if (n !== void 0) {
            let u = n instanceof ye.Name ? n : i.let('data', n, !0);
            l(u), a !== void 0 && (t.propertyName = a);
        }
        o && (t.dataTypes = o);
        function l(u) {
            (t.data = u),
                (t.dataLevel = e.dataLevel + 1),
                (t.dataTypes = []),
                (e.definedProperties = new Set()),
                (t.parentData = e.data),
                (t.dataNames = [...e.dataNames, u]);
        }
    }
    Ie.extendSubschemaData = uu;
    function lu(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: s, createErrors: n, allErrors: o }) {
        s !== void 0 && (t.compositeRule = s),
            n !== void 0 && (t.createErrors = n),
            o !== void 0 && (t.allErrors = o),
            (t.jtdDiscriminator = e),
            (t.jtdMetadata = r);
    }
    Ie.extendSubschemaMode = lu;
});
var ns = _((jh, oo) => {
    'use strict';
    oo.exports = function t(e, r) {
        if (e === r) return !0;
        if (e && r && typeof e == 'object' && typeof r == 'object') {
            if (e.constructor !== r.constructor) return !1;
            var s, n, o;
            if (Array.isArray(e)) {
                if (((s = e.length), s != r.length)) return !1;
                for (n = s; n-- !== 0; ) if (!t(e[n], r[n])) return !1;
                return !0;
            }
            if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
            if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
            if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
            if (((o = Object.keys(e)), (s = o.length), s !== Object.keys(r).length)) return !1;
            for (n = s; n-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(r, o[n])) return !1;
            for (n = s; n-- !== 0; ) {
                var a = o[n];
                if (!t(e[a], r[a])) return !1;
            }
            return !0;
        }
        return e !== e && r !== r;
    };
});
var io = _((Ah, ao) => {
    'use strict';
    var ke = (ao.exports = function (t, e, r) {
        typeof e == 'function' && ((r = e), (e = {})), (r = e.cb || r);
        var s = typeof r == 'function' ? r : r.pre || function () {},
            n = r.post || function () {};
        tr(e, s, n, t, '', t);
    });
    ke.keywords = {
        additionalItems: !0,
        items: !0,
        contains: !0,
        additionalProperties: !0,
        propertyNames: !0,
        not: !0,
        if: !0,
        then: !0,
        else: !0,
    };
    ke.arrayKeywords = { items: !0, allOf: !0, anyOf: !0, oneOf: !0 };
    ke.propsKeywords = { $defs: !0, definitions: !0, properties: !0, patternProperties: !0, dependencies: !0 };
    ke.skipKeywords = {
        default: !0,
        enum: !0,
        const: !0,
        required: !0,
        maximum: !0,
        minimum: !0,
        exclusiveMaximum: !0,
        exclusiveMinimum: !0,
        multipleOf: !0,
        maxLength: !0,
        minLength: !0,
        pattern: !0,
        format: !0,
        maxItems: !0,
        minItems: !0,
        uniqueItems: !0,
        maxProperties: !0,
        minProperties: !0,
    };
    function tr(t, e, r, s, n, o, a, i, l, u) {
        if (s && typeof s == 'object' && !Array.isArray(s)) {
            e(s, n, o, a, i, l, u);
            for (var c in s) {
                var d = s[c];
                if (Array.isArray(d)) {
                    if (c in ke.arrayKeywords)
                        for (var h = 0; h < d.length; h++) tr(t, e, r, d[h], `${n}/${c}/${h}`, o, n, c, s, h);
                } else if (c in ke.propsKeywords) {
                    if (d && typeof d == 'object')
                        for (var m in d) tr(t, e, r, d[m], `${n}/${c}/${du(m)}`, o, n, c, s, m);
                } else
                    (c in ke.keywords || (t.allKeys && !(c in ke.skipKeywords))) &&
                        tr(t, e, r, d, `${n}/${c}`, o, n, c, s);
            }
            r(s, n, o, a, i, l, u);
        }
    }
    function du(t) {
        return t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
});
var bt = _((Z) => {
    'use strict';
    Object.defineProperty(Z, '__esModule', { value: !0 });
    Z.getSchemaRefs = Z.resolveUrl = Z.normalizeId = Z._getFullPath = Z.getFullPath = Z.inlineRef = void 0;
    var fu = C(),
        pu = ns(),
        hu = io(),
        mu = new Set([
            'type',
            'format',
            'pattern',
            'maxLength',
            'minLength',
            'maxProperties',
            'minProperties',
            'maxItems',
            'minItems',
            'maximum',
            'minimum',
            'uniqueItems',
            'multipleOf',
            'required',
            'enum',
            'const',
        ]);
    function yu(t, e = !0) {
        return typeof t == 'boolean' ? !0 : e === !0 ? !os(t) : e ? co(t) <= e : !1;
    }
    Z.inlineRef = yu;
    var gu = new Set(['$ref', '$recursiveRef', '$recursiveAnchor', '$dynamicRef', '$dynamicAnchor']);
    function os(t) {
        for (let e in t) {
            if (gu.has(e)) return !0;
            let r = t[e];
            if ((Array.isArray(r) && r.some(os)) || (typeof r == 'object' && os(r))) return !0;
        }
        return !1;
    }
    function co(t) {
        let e = 0;
        for (let r in t) {
            if (r === '$ref') return 1 / 0;
            if (
                (e++,
                !mu.has(r) && (typeof t[r] == 'object' && (0, fu.eachItem)(t[r], (s) => (e += co(s))), e === 1 / 0))
            )
                return 1 / 0;
        }
        return e;
    }
    function uo(t, e = '', r) {
        r !== !1 && (e = tt(e));
        let s = t.parse(e);
        return lo(t, s);
    }
    Z.getFullPath = uo;
    function lo(t, e) {
        return `${t.serialize(e).split('#')[0]}#`;
    }
    Z._getFullPath = lo;
    var _u = /#\/?$/;
    function tt(t) {
        return t ? t.replace(_u, '') : '';
    }
    Z.normalizeId = tt;
    function $u(t, e, r) {
        return (r = tt(r)), t.resolve(e, r);
    }
    Z.resolveUrl = $u;
    var vu = /^[a-z_][-a-z0-9._]*$/i;
    function wu(t, e) {
        if (typeof t == 'boolean') return {};
        let { schemaId: r, uriResolver: s } = this.opts,
            n = tt(t[r] || e),
            o = { '': n },
            a = uo(s, n, !1),
            i = {},
            l = new Set();
        return (
            hu(t, { allKeys: !0 }, (d, h, m, f) => {
                if (f === void 0) return;
                let p = a + h,
                    y = o[f];
                typeof d[r] == 'string' && (y = g.call(this, d[r])),
                    $.call(this, d.$anchor),
                    $.call(this, d.$dynamicAnchor),
                    (o[h] = y);
                function g(w) {
                    let b = this.opts.uriResolver.resolve;
                    if (((w = tt(y ? b(y, w) : w)), l.has(w))) throw c(w);
                    l.add(w);
                    let v = this.refs[w];
                    return (
                        typeof v == 'string' && (v = this.refs[v]),
                        typeof v == 'object'
                            ? u(d, v.schema, w)
                            : w !== tt(p) && (w[0] === '#' ? (u(d, i[w], w), (i[w] = d)) : (this.refs[w] = p)),
                        w
                    );
                }
                function $(w) {
                    if (typeof w == 'string') {
                        if (!vu.test(w)) throw new Error(`invalid anchor "${w}"`);
                        g.call(this, `#${w}`);
                    }
                }
            }),
            i
        );
        function u(d, h, m) {
            if (h !== void 0 && !pu(d, h)) throw c(m);
        }
        function c(d) {
            return new Error(`reference "${d}" resolves to more than one schema`);
        }
    }
    Z.getSchemaRefs = wu;
});
var Nt = _((Ce) => {
    'use strict';
    Object.defineProperty(Ce, '__esModule', { value: !0 });
    Ce.getData = Ce.KeywordCxt = Ce.validateFunctionCode = void 0;
    var yo = Fn(),
        fo = Et(),
        is = Qr(),
        rr = Et(),
        Eu = Qn(),
        Pt = ro(),
        as = no(),
        E = O(),
        S = we(),
        bu = bt(),
        Ee = C(),
        St = wt();
    function Su(t) {
        if ($o(t) && (vo(t), _o(t))) {
            Ou(t);
            return;
        }
        go(t, () => (0, yo.topBoolOrEmptySchema)(t));
    }
    Ce.validateFunctionCode = Su;
    function go({ gen: t, validateName: e, schema: r, schemaEnv: s, opts: n }, o) {
        n.code.es5
            ? t.func(e, (0, E._)`${S.default.data}, ${S.default.valCxt}`, s.$async, () => {
                  t.code((0, E._)`"use strict"; ${po(r, n)}`), Nu(t, n), t.code(o);
              })
            : t.func(e, (0, E._)`${S.default.data}, ${Pu(n)}`, s.$async, () => t.code(po(r, n)).code(o));
    }
    function Pu(t) {
        return (0,
        E._)`{${S.default.instancePath}="", ${S.default.parentData}, ${S.default.parentDataProperty}, ${S.default.rootData}=${S.default.data}${t.dynamicRef ? (0, E._)`, ${S.default.dynamicAnchors}={}` : E.nil}}={}`;
    }
    function Nu(t, e) {
        t.if(
            S.default.valCxt,
            () => {
                t.var(S.default.instancePath, (0, E._)`${S.default.valCxt}.${S.default.instancePath}`),
                    t.var(S.default.parentData, (0, E._)`${S.default.valCxt}.${S.default.parentData}`),
                    t.var(S.default.parentDataProperty, (0, E._)`${S.default.valCxt}.${S.default.parentDataProperty}`),
                    t.var(S.default.rootData, (0, E._)`${S.default.valCxt}.${S.default.rootData}`),
                    e.dynamicRef &&
                        t.var(S.default.dynamicAnchors, (0, E._)`${S.default.valCxt}.${S.default.dynamicAnchors}`);
            },
            () => {
                t.var(S.default.instancePath, (0, E._)`""`),
                    t.var(S.default.parentData, (0, E._)`undefined`),
                    t.var(S.default.parentDataProperty, (0, E._)`undefined`),
                    t.var(S.default.rootData, S.default.data),
                    e.dynamicRef && t.var(S.default.dynamicAnchors, (0, E._)`{}`);
            },
        );
    }
    function Ou(t) {
        let { schema: e, opts: r, gen: s } = t;
        go(t, () => {
            r.$comment && e.$comment && Eo(t),
                Cu(t),
                s.let(S.default.vErrors, null),
                s.let(S.default.errors, 0),
                r.unevaluated && Ru(t),
                wo(t),
                Au(t);
        });
    }
    function Ru(t) {
        let { gen: e, validateName: r } = t;
        (t.evaluated = e.const('evaluated', (0, E._)`${r}.evaluated`)),
            e.if((0, E._)`${t.evaluated}.dynamicProps`, () =>
                e.assign((0, E._)`${t.evaluated}.props`, (0, E._)`undefined`),
            ),
            e.if((0, E._)`${t.evaluated}.dynamicItems`, () =>
                e.assign((0, E._)`${t.evaluated}.items`, (0, E._)`undefined`),
            );
    }
    function po(t, e) {
        let r = typeof t == 'object' && t[e.schemaId];
        return r && (e.code.source || e.code.process) ? (0, E._)`/*# sourceURL=${r} */` : E.nil;
    }
    function Tu(t, e) {
        if ($o(t) && (vo(t), _o(t))) {
            Iu(t, e);
            return;
        }
        (0, yo.boolOrEmptySchema)(t, e);
    }
    function _o({ schema: t, self: e }) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e.RULES.all[r]) return !0;
        return !1;
    }
    function $o(t) {
        return typeof t.schema != 'boolean';
    }
    function Iu(t, e) {
        let { schema: r, gen: s, opts: n } = t;
        n.$comment && r.$comment && Eo(t), qu(t), ju(t);
        let o = s.const('_errs', S.default.errors);
        wo(t, o), s.var(e, (0, E._)`${o} === ${S.default.errors}`);
    }
    function vo(t) {
        (0, Ee.checkUnknownRules)(t), ku(t);
    }
    function wo(t, e) {
        if (t.opts.jtd) return ho(t, [], !1, e);
        let r = (0, fo.getSchemaTypes)(t.schema),
            s = (0, fo.coerceAndCheckDataType)(t, r);
        ho(t, r, !s, e);
    }
    function ku(t) {
        let { schema: e, errSchemaPath: r, opts: s, self: n } = t;
        e.$ref &&
            s.ignoreKeywordsWithRef &&
            (0, Ee.schemaHasRulesButRef)(e, n.RULES) &&
            n.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
    }
    function Cu(t) {
        let { schema: e, opts: r } = t;
        e.default !== void 0 &&
            r.useDefaults &&
            r.strictSchema &&
            (0, Ee.checkStrictMode)(t, 'default is ignored in the schema root');
    }
    function qu(t) {
        let e = t.schema[t.opts.schemaId];
        e && (t.baseId = (0, bu.resolveUrl)(t.opts.uriResolver, t.baseId, e));
    }
    function ju(t) {
        if (t.schema.$async && !t.schemaEnv.$async) throw new Error('async schema in sync schema');
    }
    function Eo({ gen: t, schemaEnv: e, schema: r, errSchemaPath: s, opts: n }) {
        let o = r.$comment;
        if (n.$comment === !0) t.code((0, E._)`${S.default.self}.logger.log(${o})`);
        else if (typeof n.$comment == 'function') {
            let a = (0, E.str)`${s}/$comment`,
                i = t.scopeValue('root', { ref: e.root });
            t.code((0, E._)`${S.default.self}.opts.$comment(${o}, ${a}, ${i}.schema)`);
        }
    }
    function Au(t) {
        let { gen: e, schemaEnv: r, validateName: s, ValidationError: n, opts: o } = t;
        r.$async
            ? e.if(
                  (0, E._)`${S.default.errors} === 0`,
                  () => e.return(S.default.data),
                  () => e.throw((0, E._)`new ${n}(${S.default.vErrors})`),
              )
            : (e.assign((0, E._)`${s}.errors`, S.default.vErrors),
              o.unevaluated && Mu(t),
              e.return((0, E._)`${S.default.errors} === 0`));
    }
    function Mu({ gen: t, evaluated: e, props: r, items: s }) {
        r instanceof E.Name && t.assign((0, E._)`${e}.props`, r),
            s instanceof E.Name && t.assign((0, E._)`${e}.items`, s);
    }
    function ho(t, e, r, s) {
        let { gen: n, schema: o, data: a, allErrors: i, opts: l, self: u } = t,
            { RULES: c } = u;
        if (o.$ref && (l.ignoreKeywordsWithRef || !(0, Ee.schemaHasRulesButRef)(o, c))) {
            n.block(() => So(t, '$ref', c.all.$ref.definition));
            return;
        }
        l.jtd || Du(t, e),
            n.block(() => {
                for (let h of c.rules) d(h);
                d(c.post);
            });
        function d(h) {
            (0, is.shouldUseGroup)(o, h) &&
                (h.type
                    ? (n.if((0, rr.checkDataType)(h.type, a, l.strictNumbers)),
                      mo(t, h),
                      e.length === 1 && e[0] === h.type && r && (n.else(), (0, rr.reportTypeError)(t)),
                      n.endIf())
                    : mo(t, h),
                i || n.if((0, E._)`${S.default.errors} === ${s || 0}`));
        }
    }
    function mo(t, e) {
        let {
            gen: r,
            schema: s,
            opts: { useDefaults: n },
        } = t;
        n && (0, Eu.assignDefaults)(t, e.type),
            r.block(() => {
                for (let o of e.rules) (0, is.shouldUseRule)(s, o) && So(t, o.keyword, o.definition, e.type);
            });
    }
    function Du(t, e) {
        t.schemaEnv.meta || !t.opts.strictTypes || (Uu(t, e), t.opts.allowUnionTypes || Vu(t, e), Ku(t, t.dataTypes));
    }
    function Uu(t, e) {
        if (e.length) {
            if (!t.dataTypes.length) {
                t.dataTypes = e;
                return;
            }
            e.forEach((r) => {
                bo(t.dataTypes, r) || cs(t, `type "${r}" not allowed by context "${t.dataTypes.join(',')}"`);
            }),
                Lu(t, e);
        }
    }
    function Vu(t, e) {
        e.length > 1 &&
            !(e.length === 2 && e.includes('null')) &&
            cs(t, 'use allowUnionTypes to allow union type keyword');
    }
    function Ku(t, e) {
        let r = t.self.RULES.all;
        for (let s in r) {
            let n = r[s];
            if (typeof n == 'object' && (0, is.shouldUseRule)(t.schema, n)) {
                let { type: o } = n.definition;
                o.length && !o.some((a) => xu(e, a)) && cs(t, `missing type "${o.join(',')}" for keyword "${s}"`);
            }
        }
    }
    function xu(t, e) {
        return t.includes(e) || (e === 'number' && t.includes('integer'));
    }
    function bo(t, e) {
        return t.includes(e) || (e === 'integer' && t.includes('number'));
    }
    function Lu(t, e) {
        let r = [];
        for (let s of t.dataTypes) bo(e, s) ? r.push(s) : e.includes('integer') && s === 'number' && r.push('integer');
        t.dataTypes = r;
    }
    function cs(t, e) {
        let r = t.schemaEnv.baseId + t.errSchemaPath;
        (e += ` at "${r}" (strictTypes)`), (0, Ee.checkStrictMode)(t, e, t.opts.strictTypes);
    }
    var sr = class {
        constructor(e, r, s) {
            if (
                ((0, Pt.validateKeywordUsage)(e, r, s),
                (this.gen = e.gen),
                (this.allErrors = e.allErrors),
                (this.keyword = s),
                (this.data = e.data),
                (this.schema = e.schema[s]),
                (this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data),
                (this.schemaValue = (0, Ee.schemaRefOrVal)(e, this.schema, s, this.$data)),
                (this.schemaType = r.schemaType),
                (this.parentSchema = e.schema),
                (this.params = {}),
                (this.it = e),
                (this.def = r),
                this.$data)
            )
                this.schemaCode = e.gen.const('vSchema', Po(this.$data, e));
            else if (
                ((this.schemaCode = this.schemaValue),
                !(0, Pt.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
            )
                throw new Error(`${s} value must be ${JSON.stringify(r.schemaType)}`);
            ('code' in r ? r.trackErrors : r.errors !== !1) &&
                (this.errsCount = e.gen.const('_errs', S.default.errors));
        }
        result(e, r, s) {
            this.failResult((0, E.not)(e), r, s);
        }
        failResult(e, r, s) {
            this.gen.if(e),
                s ? s() : this.error(),
                r
                    ? (this.gen.else(), r(), this.allErrors && this.gen.endIf())
                    : this.allErrors
                      ? this.gen.endIf()
                      : this.gen.else();
        }
        pass(e, r) {
            this.failResult((0, E.not)(e), void 0, r);
        }
        fail(e) {
            if (e === void 0) {
                this.error(), this.allErrors || this.gen.if(!1);
                return;
            }
            this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
        }
        fail$data(e) {
            if (!this.$data) return this.fail(e);
            let { schemaCode: r } = this;
            this.fail((0, E._)`${r} !== undefined && (${(0, E.or)(this.invalid$data(), e)})`);
        }
        error(e, r, s) {
            if (r) {
                this.setParams(r), this._error(e, s), this.setParams({});
                return;
            }
            this._error(e, s);
        }
        _error(e, r) {
            (e ? St.reportExtraError : St.reportError)(this, this.def.error, r);
        }
        $dataError() {
            (0, St.reportError)(this, this.def.$dataError || St.keyword$DataError);
        }
        reset() {
            if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
            (0, St.resetErrorsCount)(this.gen, this.errsCount);
        }
        ok(e) {
            this.allErrors || this.gen.if(e);
        }
        setParams(e, r) {
            r ? Object.assign(this.params, e) : (this.params = e);
        }
        block$data(e, r, s = E.nil) {
            this.gen.block(() => {
                this.check$data(e, s), r();
            });
        }
        check$data(e = E.nil, r = E.nil) {
            if (!this.$data) return;
            let { gen: s, schemaCode: n, schemaType: o, def: a } = this;
            s.if((0, E.or)((0, E._)`${n} === undefined`, r)),
                e !== E.nil && s.assign(e, !0),
                (o.length || a.validateSchema) &&
                    (s.elseIf(this.invalid$data()), this.$dataError(), e !== E.nil && s.assign(e, !1)),
                s.else();
        }
        invalid$data() {
            let { gen: e, schemaCode: r, schemaType: s, def: n, it: o } = this;
            return (0, E.or)(a(), i());
            function a() {
                if (s.length) {
                    if (!(r instanceof E.Name)) throw new Error('ajv implementation error');
                    let l = Array.isArray(s) ? s : [s];
                    return (0, E._)`${(0, rr.checkDataTypes)(l, r, o.opts.strictNumbers, rr.DataType.Wrong)}`;
                }
                return E.nil;
            }
            function i() {
                if (n.validateSchema) {
                    let l = e.scopeValue('validate$data', { ref: n.validateSchema });
                    return (0, E._)`!${l}(${r})`;
                }
                return E.nil;
            }
        }
        subschema(e, r) {
            let s = (0, as.getSubschema)(this.it, e);
            (0, as.extendSubschemaData)(s, this.it, e), (0, as.extendSubschemaMode)(s, e);
            let n = { ...this.it, ...s, items: void 0, props: void 0 };
            return Tu(n, r), n;
        }
        mergeEvaluated(e, r) {
            let { it: s, gen: n } = this;
            s.opts.unevaluated &&
                (s.props !== !0 && e.props !== void 0 && (s.props = Ee.mergeEvaluated.props(n, e.props, s.props, r)),
                s.items !== !0 && e.items !== void 0 && (s.items = Ee.mergeEvaluated.items(n, e.items, s.items, r)));
        }
        mergeValidEvaluated(e, r) {
            let { it: s, gen: n } = this;
            if (s.opts.unevaluated && (s.props !== !0 || s.items !== !0))
                return n.if(r, () => this.mergeEvaluated(e, E.Name)), !0;
        }
    };
    Ce.KeywordCxt = sr;
    function So(t, e, r, s) {
        let n = new sr(t, r, e);
        'code' in r
            ? r.code(n, s)
            : n.$data && r.validate
              ? (0, Pt.funcKeywordCode)(n, r)
              : 'macro' in r
                ? (0, Pt.macroKeywordCode)(n, r)
                : (r.compile || r.validate) && (0, Pt.funcKeywordCode)(n, r);
    }
    var zu = /^\/(?:[^~]|~0|~1)*$/,
        Fu = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function Po(t, { dataLevel: e, dataNames: r, dataPathArr: s }) {
        let n, o;
        if (t === '') return S.default.rootData;
        if (t[0] === '/') {
            if (!zu.test(t)) throw new Error(`Invalid JSON-pointer: ${t}`);
            (n = t), (o = S.default.rootData);
        } else {
            let u = Fu.exec(t);
            if (!u) throw new Error(`Invalid JSON-pointer: ${t}`);
            let c = +u[1];
            if (((n = u[2]), n === '#')) {
                if (c >= e) throw new Error(l('property/index', c));
                return s[e - c];
            }
            if (c > e) throw new Error(l('data', c));
            if (((o = r[e - c]), !n)) return o;
        }
        let a = o,
            i = n.split('/');
        for (let u of i)
            u &&
                ((o = (0, E._)`${o}${(0, E.getProperty)((0, Ee.unescapeJsonPointer)(u))}`),
                (a = (0, E._)`${a} && ${o}`));
        return a;
        function l(u, c) {
            return `Cannot access ${u} ${c} levels up, current level is ${e}`;
        }
    }
    Ce.getData = Po;
});
var nr = _((ls) => {
    'use strict';
    Object.defineProperty(ls, '__esModule', { value: !0 });
    var us = class extends Error {
        constructor(e) {
            super('validation failed'), (this.errors = e), (this.ajv = this.validation = !0);
        }
    };
    ls.default = us;
});
var Ot = _((ps) => {
    'use strict';
    Object.defineProperty(ps, '__esModule', { value: !0 });
    var ds = bt(),
        fs = class extends Error {
            constructor(e, r, s, n) {
                super(n || `can't resolve reference ${s} from id ${r}`),
                    (this.missingRef = (0, ds.resolveUrl)(e, r, s)),
                    (this.missingSchema = (0, ds.normalizeId)((0, ds.getFullPath)(e, this.missingRef)));
            }
        };
    ps.default = fs;
});
var ar = _((ne) => {
    'use strict';
    Object.defineProperty(ne, '__esModule', { value: !0 });
    ne.resolveSchema = ne.getCompilingSchema = ne.resolveRef = ne.compileSchema = ne.SchemaEnv = void 0;
    var ie = O(),
        Gu = nr(),
        Le = we(),
        ce = bt(),
        No = C(),
        Hu = Nt(),
        rt = class {
            constructor(e) {
                var r;
                (this.refs = {}), (this.dynamicAnchors = {});
                let s;
                typeof e.schema == 'object' && (s = e.schema),
                    (this.schema = e.schema),
                    (this.schemaId = e.schemaId),
                    (this.root = e.root || this),
                    (this.baseId =
                        (r = e.baseId) !== null && r !== void 0 ? r : (0, ce.normalizeId)(s?.[e.schemaId || '$id'])),
                    (this.schemaPath = e.schemaPath),
                    (this.localRefs = e.localRefs),
                    (this.meta = e.meta),
                    (this.$async = s?.$async),
                    (this.refs = {});
            }
        };
    ne.SchemaEnv = rt;
    function ms(t) {
        let e = Oo.call(this, t);
        if (e) return e;
        let r = (0, ce.getFullPath)(this.opts.uriResolver, t.root.baseId),
            { es5: s, lines: n } = this.opts.code,
            { ownProperties: o } = this.opts,
            a = new ie.CodeGen(this.scope, { es5: s, lines: n, ownProperties: o }),
            i;
        t.$async &&
            (i = a.scopeValue('Error', {
                ref: Gu.default,
                code: (0, ie._)`require("ajv/dist/runtime/validation_error").default`,
            }));
        let l = a.scopeName('validate');
        t.validateName = l;
        let u = {
                gen: a,
                allErrors: this.opts.allErrors,
                data: Le.default.data,
                parentData: Le.default.parentData,
                parentDataProperty: Le.default.parentDataProperty,
                dataNames: [Le.default.data],
                dataPathArr: [ie.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set(),
                topSchemaRef: a.scopeValue(
                    'schema',
                    this.opts.code.source === !0
                        ? { ref: t.schema, code: (0, ie.stringify)(t.schema) }
                        : { ref: t.schema },
                ),
                validateName: l,
                ValidationError: i,
                schema: t.schema,
                schemaEnv: t,
                rootId: r,
                baseId: t.baseId || r,
                schemaPath: ie.nil,
                errSchemaPath: t.schemaPath || (this.opts.jtd ? '' : '#'),
                errorPath: (0, ie._)`""`,
                opts: this.opts,
                self: this,
            },
            c;
        try {
            this._compilations.add(t), (0, Hu.validateFunctionCode)(u), a.optimize(this.opts.code.optimize);
            let d = a.toString();
            (c = `${a.scopeRefs(Le.default.scope)}return ${d}`),
                this.opts.code.process && (c = this.opts.code.process(c, t));
            let m = new Function(`${Le.default.self}`, `${Le.default.scope}`, c)(this, this.scope.get());
            if (
                (this.scope.value(l, { ref: m }),
                (m.errors = null),
                (m.schema = t.schema),
                (m.schemaEnv = t),
                t.$async && (m.$async = !0),
                this.opts.code.source === !0 &&
                    (m.source = { validateName: l, validateCode: d, scopeValues: a._values }),
                this.opts.unevaluated)
            ) {
                let { props: f, items: p } = u;
                (m.evaluated = {
                    props: f instanceof ie.Name ? void 0 : f,
                    items: p instanceof ie.Name ? void 0 : p,
                    dynamicProps: f instanceof ie.Name,
                    dynamicItems: p instanceof ie.Name,
                }),
                    m.source && (m.source.evaluated = (0, ie.stringify)(m.evaluated));
            }
            return (t.validate = m), t;
        } catch (d) {
            throw (
                (delete t.validate,
                delete t.validateName,
                c && this.logger.error('Error compiling schema, function code:', c),
                d)
            );
        } finally {
            this._compilations.delete(t);
        }
    }
    ne.compileSchema = ms;
    function Bu(t, e, r) {
        var s;
        r = (0, ce.resolveUrl)(this.opts.uriResolver, e, r);
        let n = t.refs[r];
        if (n) return n;
        let o = Yu.call(this, t, r);
        if (o === void 0) {
            let a = (s = t.localRefs) === null || s === void 0 ? void 0 : s[r],
                { schemaId: i } = this.opts;
            a && (o = new rt({ schema: a, schemaId: i, root: t, baseId: e }));
        }
        if (o !== void 0) return (t.refs[r] = Ju.call(this, o));
    }
    ne.resolveRef = Bu;
    function Ju(t) {
        return (0, ce.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : ms.call(this, t);
    }
    function Oo(t) {
        for (let e of this._compilations) if (Wu(e, t)) return e;
    }
    ne.getCompilingSchema = Oo;
    function Wu(t, e) {
        return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
    }
    function Yu(t, e) {
        let r;
        for (; typeof (r = this.refs[e]) == 'string'; ) e = r;
        return r || this.schemas[e] || or.call(this, t, e);
    }
    function or(t, e) {
        let r = this.opts.uriResolver.parse(e),
            s = (0, ce._getFullPath)(this.opts.uriResolver, r),
            n = (0, ce.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
        if (Object.keys(t.schema).length > 0 && s === n) return hs.call(this, r, t);
        let o = (0, ce.normalizeId)(s),
            a = this.refs[o] || this.schemas[o];
        if (typeof a == 'string') {
            let i = or.call(this, t, a);
            return typeof i?.schema != 'object' ? void 0 : hs.call(this, r, i);
        }
        if (typeof a?.schema == 'object') {
            if ((a.validate || ms.call(this, a), o === (0, ce.normalizeId)(e))) {
                let { schema: i } = a,
                    { schemaId: l } = this.opts,
                    u = i[l];
                return (
                    u && (n = (0, ce.resolveUrl)(this.opts.uriResolver, n, u)),
                    new rt({ schema: i, schemaId: l, root: t, baseId: n })
                );
            }
            return hs.call(this, r, a);
        }
    }
    ne.resolveSchema = or;
    var Qu = new Set(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
    function hs(t, { baseId: e, schema: r, root: s }) {
        var n;
        if (((n = t.fragment) === null || n === void 0 ? void 0 : n[0]) !== '/') return;
        for (let i of t.fragment.slice(1).split('/')) {
            if (typeof r == 'boolean') return;
            let l = r[(0, No.unescapeFragment)(i)];
            if (l === void 0) return;
            r = l;
            let u = typeof r == 'object' && r[this.opts.schemaId];
            !Qu.has(i) && u && (e = (0, ce.resolveUrl)(this.opts.uriResolver, e, u));
        }
        let o;
        if (typeof r != 'boolean' && r.$ref && !(0, No.schemaHasRulesButRef)(r, this.RULES)) {
            let i = (0, ce.resolveUrl)(this.opts.uriResolver, e, r.$ref);
            o = or.call(this, s, i);
        }
        let { schemaId: a } = this.opts;
        if (((o = o || new rt({ schema: r, schemaId: a, root: s, baseId: e })), o.schema !== o.root.schema)) return o;
    }
});
var Ro = _((xh, Xu) => {
    Xu.exports = {
        $id: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#',
        description: 'Meta-schema for $data reference (JSON AnySchema extension proposal)',
        type: 'object',
        required: ['$data'],
        properties: {
            $data: { type: 'string', anyOf: [{ format: 'relative-json-pointer' }, { format: 'json-pointer' }] },
        },
        additionalProperties: !1,
    };
});
var Io = _((Lh, To) => {
    'use strict';
    var Zu = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        a: 10,
        A: 10,
        b: 11,
        B: 11,
        c: 12,
        C: 12,
        d: 13,
        D: 13,
        e: 14,
        E: 14,
        f: 15,
        F: 15,
    };
    To.exports = { HEX: Zu };
});
var Uo = _((zh, Do) => {
    'use strict';
    var { HEX: el } = Io();
    function jo(t) {
        if (Mo(t, '.') < 3) return { host: t, isIPV4: !1 };
        let e =
                t.match(
                    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u,
                ) || [],
            [r] = e;
        return r ? { host: rl(r, '.'), isIPV4: !0 } : { host: t, isIPV4: !1 };
    }
    function ys(t, e = !1) {
        let r = '',
            s = !0;
        for (let n of t) {
            if (el[n] === void 0) return;
            n !== '0' && s === !0 && (s = !1), s || (r += n);
        }
        return e && r.length === 0 && (r = '0'), r;
    }
    function tl(t) {
        let e = 0,
            r = { error: !1, address: '', zone: '' },
            s = [],
            n = [],
            o = !1,
            a = !1,
            i = !1;
        function l() {
            if (n.length) {
                if (o === !1) {
                    let u = ys(n);
                    if (u !== void 0) s.push(u);
                    else return (r.error = !0), !1;
                }
                n.length = 0;
            }
            return !0;
        }
        for (let u = 0; u < t.length; u++) {
            let c = t[u];
            if (!(c === '[' || c === ']'))
                if (c === ':') {
                    if ((a === !0 && (i = !0), !l())) break;
                    if ((e++, s.push(':'), e > 7)) {
                        r.error = !0;
                        break;
                    }
                    u - 1 >= 0 && t[u - 1] === ':' && (a = !0);
                    continue;
                } else if (c === '%') {
                    if (!l()) break;
                    o = !0;
                } else {
                    n.push(c);
                    continue;
                }
        }
        return (
            n.length && (o ? (r.zone = n.join('')) : i ? s.push(n.join('')) : s.push(ys(n))),
            (r.address = s.join('')),
            r
        );
    }
    function Ao(t, e = {}) {
        if (Mo(t, ':') < 2) return { host: t, isIPV6: !1 };
        let r = tl(t);
        if (r.error) return { host: t, isIPV6: !1 };
        {
            let s = r.address,
                n = r.address;
            return r.zone && ((s += `%${r.zone}`), (n += `%25${r.zone}`)), { host: s, escapedHost: n, isIPV6: !0 };
        }
    }
    function rl(t, e) {
        let r = '',
            s = !0,
            n = t.length;
        for (let o = 0; o < n; o++) {
            let a = t[o];
            a === '0' && s
                ? ((o + 1 <= n && t[o + 1] === e) || o + 1 === n) && ((r += a), (s = !1))
                : (a === e ? (s = !0) : (s = !1), (r += a));
        }
        return r;
    }
    function Mo(t, e) {
        let r = 0;
        for (let s = 0; s < t.length; s++) t[s] === e && r++;
        return r;
    }
    var ko = /^\.\.?\//u,
        Co = /^\/\.(?:\/|$)/u,
        qo = /^\/\.\.(?:\/|$)/u,
        sl = /^\/?(?:.|\n)*?(?=\/|$)/u;
    function nl(t) {
        let e = [];
        for (; t.length; )
            if (t.match(ko)) t = t.replace(ko, '');
            else if (t.match(Co)) t = t.replace(Co, '/');
            else if (t.match(qo)) (t = t.replace(qo, '/')), e.pop();
            else if (t === '.' || t === '..') t = '';
            else {
                let r = t.match(sl);
                if (r) {
                    let s = r[0];
                    (t = t.slice(s.length)), e.push(s);
                } else throw new Error('Unexpected dot segment condition');
            }
        return e.join('');
    }
    function ol(t, e) {
        let r = e !== !0 ? escape : unescape;
        return (
            t.scheme !== void 0 && (t.scheme = r(t.scheme)),
            t.userinfo !== void 0 && (t.userinfo = r(t.userinfo)),
            t.host !== void 0 && (t.host = r(t.host)),
            t.path !== void 0 && (t.path = r(t.path)),
            t.query !== void 0 && (t.query = r(t.query)),
            t.fragment !== void 0 && (t.fragment = r(t.fragment)),
            t
        );
    }
    function al(t, e) {
        let r = [];
        if ((t.userinfo !== void 0 && (r.push(t.userinfo), r.push('@')), t.host !== void 0)) {
            let s = unescape(t.host),
                n = jo(s);
            if (n.isIPV4) s = n.host;
            else {
                let o = Ao(n.host, { isIPV4: !1 });
                o.isIPV6 === !0 ? (s = `[${o.escapedHost}]`) : (s = t.host);
            }
            r.push(s);
        }
        return (
            (typeof t.port == 'number' || typeof t.port == 'string') && (r.push(':'), r.push(String(t.port))),
            r.length ? r.join('') : void 0
        );
    }
    Do.exports = {
        recomposeAuthority: al,
        normalizeComponentEncoding: ol,
        removeDotSegments: nl,
        normalizeIPv4: jo,
        normalizeIPv6: Ao,
        stringArrayToHexStripped: ys,
    };
});
var Fo = _((Fh, zo) => {
    'use strict';
    var il = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu,
        cl = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    function Vo(t) {
        return typeof t.secure == 'boolean' ? t.secure : String(t.scheme).toLowerCase() === 'wss';
    }
    function Ko(t) {
        return t.host || (t.error = t.error || 'HTTP URIs must have a host.'), t;
    }
    function xo(t) {
        let e = String(t.scheme).toLowerCase() === 'https';
        return (t.port === (e ? 443 : 80) || t.port === '') && (t.port = void 0), t.path || (t.path = '/'), t;
    }
    function ul(t) {
        return (
            (t.secure = Vo(t)),
            (t.resourceName = (t.path || '/') + (t.query ? `?${t.query}` : '')),
            (t.path = void 0),
            (t.query = void 0),
            t
        );
    }
    function ll(t) {
        if (
            ((t.port === (Vo(t) ? 443 : 80) || t.port === '') && (t.port = void 0),
            typeof t.secure == 'boolean' && ((t.scheme = t.secure ? 'wss' : 'ws'), (t.secure = void 0)),
            t.resourceName)
        ) {
            let [e, r] = t.resourceName.split('?');
            (t.path = e && e !== '/' ? e : void 0), (t.query = r), (t.resourceName = void 0);
        }
        return (t.fragment = void 0), t;
    }
    function dl(t, e) {
        if (!t.path) return (t.error = 'URN can not be parsed'), t;
        let r = t.path.match(cl);
        if (r) {
            let s = e.scheme || t.scheme || 'urn';
            (t.nid = r[1].toLowerCase()), (t.nss = r[2]);
            let n = `${s}:${e.nid || t.nid}`,
                o = gs[n];
            (t.path = void 0), o && (t = o.parse(t, e));
        } else t.error = t.error || 'URN can not be parsed.';
        return t;
    }
    function fl(t, e) {
        let r = e.scheme || t.scheme || 'urn',
            s = t.nid.toLowerCase(),
            n = `${r}:${e.nid || s}`,
            o = gs[n];
        o && (t = o.serialize(t, e));
        let a = t,
            i = t.nss;
        return (a.path = `${s || e.nid}:${i}`), (e.skipEscape = !0), a;
    }
    function pl(t, e) {
        let r = t;
        return (
            (r.uuid = r.nss),
            (r.nss = void 0),
            !e.tolerant && (!r.uuid || !il.test(r.uuid)) && (r.error = r.error || 'UUID is not valid.'),
            r
        );
    }
    function hl(t) {
        let e = t;
        return (e.nss = (t.uuid || '').toLowerCase()), e;
    }
    var Lo = { scheme: 'http', domainHost: !0, parse: Ko, serialize: xo },
        ml = { scheme: 'https', domainHost: Lo.domainHost, parse: Ko, serialize: xo },
        ir = { scheme: 'ws', domainHost: !0, parse: ul, serialize: ll },
        yl = { scheme: 'wss', domainHost: ir.domainHost, parse: ir.parse, serialize: ir.serialize },
        gl = { scheme: 'urn', parse: dl, serialize: fl, skipNormalize: !0 },
        _l = { scheme: 'urn:uuid', parse: pl, serialize: hl, skipNormalize: !0 },
        gs = { http: Lo, https: ml, ws: ir, wss: yl, urn: gl, 'urn:uuid': _l };
    zo.exports = gs;
});
var Ho = _((Gh, ur) => {
    'use strict';
    var {
            normalizeIPv6: $l,
            normalizeIPv4: vl,
            removeDotSegments: Rt,
            recomposeAuthority: wl,
            normalizeComponentEncoding: cr,
        } = Uo(),
        _s = Fo();
    function El(t, e) {
        return typeof t == 'string' ? (t = ge(be(t, e), e)) : typeof t == 'object' && (t = be(ge(t, e), e)), t;
    }
    function bl(t, e, r) {
        let s = Object.assign({ scheme: 'null' }, r),
            n = Go(be(t, s), be(e, s), s, !0);
        return ge(n, { ...s, skipEscape: !0 });
    }
    function Go(t, e, r, s) {
        let n = {};
        return (
            s || ((t = be(ge(t, r), r)), (e = be(ge(e, r), r))),
            (r = r || {}),
            !r.tolerant && e.scheme
                ? ((n.scheme = e.scheme),
                  (n.userinfo = e.userinfo),
                  (n.host = e.host),
                  (n.port = e.port),
                  (n.path = Rt(e.path || '')),
                  (n.query = e.query))
                : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0
                      ? ((n.userinfo = e.userinfo),
                        (n.host = e.host),
                        (n.port = e.port),
                        (n.path = Rt(e.path || '')),
                        (n.query = e.query))
                      : (e.path
                            ? (e.path.charAt(0) === '/'
                                  ? (n.path = Rt(e.path))
                                  : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path
                                        ? (n.path = `/${e.path}`)
                                        : t.path
                                          ? (n.path = t.path.slice(0, t.path.lastIndexOf('/') + 1) + e.path)
                                          : (n.path = e.path),
                                    (n.path = Rt(n.path))),
                              (n.query = e.query))
                            : ((n.path = t.path), e.query !== void 0 ? (n.query = e.query) : (n.query = t.query)),
                        (n.userinfo = t.userinfo),
                        (n.host = t.host),
                        (n.port = t.port)),
                  (n.scheme = t.scheme)),
            (n.fragment = e.fragment),
            n
        );
    }
    function Sl(t, e, r) {
        return (
            typeof t == 'string'
                ? ((t = unescape(t)), (t = ge(cr(be(t, r), !0), { ...r, skipEscape: !0 })))
                : typeof t == 'object' && (t = ge(cr(t, !0), { ...r, skipEscape: !0 })),
            typeof e == 'string'
                ? ((e = unescape(e)), (e = ge(cr(be(e, r), !0), { ...r, skipEscape: !0 })))
                : typeof e == 'object' && (e = ge(cr(e, !0), { ...r, skipEscape: !0 })),
            t.toLowerCase() === e.toLowerCase()
        );
    }
    function ge(t, e) {
        let r = {
                host: t.host,
                scheme: t.scheme,
                userinfo: t.userinfo,
                port: t.port,
                path: t.path,
                query: t.query,
                nid: t.nid,
                nss: t.nss,
                uuid: t.uuid,
                fragment: t.fragment,
                reference: t.reference,
                resourceName: t.resourceName,
                secure: t.secure,
                error: '',
            },
            s = Object.assign({}, e),
            n = [],
            o = _s[(s.scheme || r.scheme || '').toLowerCase()];
        o && o.serialize && o.serialize(r, s),
            r.path !== void 0 &&
                (s.skipEscape
                    ? (r.path = unescape(r.path))
                    : ((r.path = escape(r.path)), r.scheme !== void 0 && (r.path = r.path.split('%3A').join(':')))),
            s.reference !== 'suffix' && r.scheme && (n.push(r.scheme), n.push(':'));
        let a = wl(r, s);
        if (
            (a !== void 0 &&
                (s.reference !== 'suffix' && n.push('//'),
                n.push(a),
                r.path && r.path.charAt(0) !== '/' && n.push('/')),
            r.path !== void 0)
        ) {
            let i = r.path;
            !s.absolutePath && (!o || !o.absolutePath) && (i = Rt(i)),
                a === void 0 && (i = i.replace(/^\/\//u, '/%2F')),
                n.push(i);
        }
        return (
            r.query !== void 0 && (n.push('?'), n.push(r.query)),
            r.fragment !== void 0 && (n.push('#'), n.push(r.fragment)),
            n.join('')
        );
    }
    var Pl = Array.from({ length: 127 }, (t, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
    function Nl(t) {
        let e = 0;
        for (let r = 0, s = t.length; r < s; ++r) if (((e = t.charCodeAt(r)), e > 126 || Pl[e])) return !0;
        return !1;
    }
    var Ol =
        /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function be(t, e) {
        let r = Object.assign({}, e),
            s = { scheme: void 0, userinfo: void 0, host: '', port: void 0, path: '', query: void 0, fragment: void 0 },
            n = t.indexOf('%') !== -1,
            o = !1;
        r.reference === 'suffix' && (t = `${r.scheme ? `${r.scheme}:` : ''}//${t}`);
        let a = t.match(Ol);
        if (a) {
            if (
                ((s.scheme = a[1]),
                (s.userinfo = a[3]),
                (s.host = a[4]),
                (s.port = parseInt(a[5], 10)),
                (s.path = a[6] || ''),
                (s.query = a[7]),
                (s.fragment = a[8]),
                isNaN(s.port) && (s.port = a[5]),
                s.host)
            ) {
                let l = vl(s.host);
                if (l.isIPV4 === !1) {
                    let u = $l(l.host, { isIPV4: !1 });
                    (s.host = u.host.toLowerCase()), (o = u.isIPV6);
                } else (s.host = l.host), (o = !0);
            }
            s.scheme === void 0 &&
            s.userinfo === void 0 &&
            s.host === void 0 &&
            s.port === void 0 &&
            !s.path &&
            s.query === void 0
                ? (s.reference = 'same-document')
                : s.scheme === void 0
                  ? (s.reference = 'relative')
                  : s.fragment === void 0
                    ? (s.reference = 'absolute')
                    : (s.reference = 'uri'),
                r.reference &&
                    r.reference !== 'suffix' &&
                    r.reference !== s.reference &&
                    (s.error = s.error || `URI is not a ${r.reference} reference.`);
            let i = _s[(r.scheme || s.scheme || '').toLowerCase()];
            if (
                !r.unicodeSupport &&
                (!i || !i.unicodeSupport) &&
                s.host &&
                (r.domainHost || (i && i.domainHost)) &&
                o === !1 &&
                Nl(s.host)
            )
                try {
                    s.host = URL.domainToASCII(s.host.toLowerCase());
                } catch (l) {
                    s.error = s.error || `Host's domain name can not be converted to ASCII: ${l}`;
                }
            (!i || (i && !i.skipNormalize)) &&
                (n && s.scheme !== void 0 && (s.scheme = unescape(s.scheme)),
                n && s.userinfo !== void 0 && (s.userinfo = unescape(s.userinfo)),
                n && s.host !== void 0 && (s.host = unescape(s.host)),
                s.path !== void 0 && s.path.length && (s.path = escape(unescape(s.path))),
                s.fragment !== void 0 && s.fragment.length && (s.fragment = encodeURI(decodeURIComponent(s.fragment)))),
                i && i.parse && i.parse(s, r);
        } else s.error = s.error || 'URI can not be parsed.';
        return s;
    }
    var $s = { SCHEMES: _s, normalize: El, resolve: bl, resolveComponents: Go, equal: Sl, serialize: ge, parse: be };
    ur.exports = $s;
    ur.exports.default = $s;
    ur.exports.fastUri = $s;
});
var Jo = _((vs) => {
    'use strict';
    Object.defineProperty(vs, '__esModule', { value: !0 });
    var Bo = Ho();
    Bo.code = 'require("ajv/dist/runtime/uri").default';
    vs.default = Bo;
});
var ra = _((x) => {
    'use strict';
    Object.defineProperty(x, '__esModule', { value: !0 });
    x.CodeGen = x.Name = x.nil = x.stringify = x.str = x._ = x.KeywordCxt = void 0;
    var Rl = Nt();
    Object.defineProperty(x, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return Rl.KeywordCxt;
        },
    });
    var st = O();
    Object.defineProperty(x, '_', {
        enumerable: !0,
        get: function () {
            return st._;
        },
    });
    Object.defineProperty(x, 'str', {
        enumerable: !0,
        get: function () {
            return st.str;
        },
    });
    Object.defineProperty(x, 'stringify', {
        enumerable: !0,
        get: function () {
            return st.stringify;
        },
    });
    Object.defineProperty(x, 'nil', {
        enumerable: !0,
        get: function () {
            return st.nil;
        },
    });
    Object.defineProperty(x, 'Name', {
        enumerable: !0,
        get: function () {
            return st.Name;
        },
    });
    Object.defineProperty(x, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return st.CodeGen;
        },
    });
    var Tl = nr(),
        Zo = Ot(),
        Il = Yr(),
        Tt = ar(),
        kl = O(),
        It = bt(),
        lr = Et(),
        Es = C(),
        Wo = Ro(),
        Cl = Jo(),
        ea = (t, e) => new RegExp(t, e);
    ea.code = 'new RegExp';
    var ql = ['removeAdditional', 'useDefaults', 'coerceTypes'],
        jl = new Set([
            'validate',
            'serialize',
            'parse',
            'wrapper',
            'root',
            'schema',
            'keyword',
            'pattern',
            'formats',
            'validate$data',
            'func',
            'obj',
            'Error',
        ]),
        Al = {
            errorDataPath: '',
            format: '`validateFormats: false` can be used instead.',
            nullable: '"nullable" keyword is supported by default.',
            jsonPointers: 'Deprecated jsPropertySyntax can be used instead.',
            extendRefs: 'Deprecated ignoreKeywordsWithRef can be used instead.',
            missingRefs: 'Pass empty schema with $id that should be ignored to ajv.addSchema.',
            processCode: 'Use option `code: {process: (code, schemaEnv: object) => string}`',
            sourceCode: 'Use option `code: {source: true}`',
            strictDefaults: 'It is default now, see option `strict`.',
            strictKeywords: 'It is default now, see option `strict`.',
            uniqueItems: '"uniqueItems" keyword is always validated.',
            unknownFormats: 'Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).',
            cache: 'Map is used as cache, schema object as key.',
            serialize: 'Map is used as cache, schema object as key.',
            ajvErrors: 'It is default now.',
        },
        Ml = {
            ignoreKeywordsWithRef: '',
            jsPropertySyntax: '',
            unicode: '"minLength"/"maxLength" account for unicode characters by default.',
        },
        Yo = 200;
    function Dl(t) {
        var e, r, s, n, o, a, i, l, u, c, d, h, m, f, p, y, g, $, w, b, v, q, V, Se, le;
        let K = t.strict,
            J = (e = t.code) === null || e === void 0 ? void 0 : e.optimize,
            Pe = J === !0 || J === void 0 ? 1 : J || 0,
            pn = (s = (r = t.code) === null || r === void 0 ? void 0 : r.regExp) !== null && s !== void 0 ? s : ea,
            pi = (n = t.uriResolver) !== null && n !== void 0 ? n : Cl.default;
        return {
            strictSchema: (a = (o = t.strictSchema) !== null && o !== void 0 ? o : K) !== null && a !== void 0 ? a : !0,
            strictNumbers:
                (l = (i = t.strictNumbers) !== null && i !== void 0 ? i : K) !== null && l !== void 0 ? l : !0,
            strictTypes:
                (c = (u = t.strictTypes) !== null && u !== void 0 ? u : K) !== null && c !== void 0 ? c : 'log',
            strictTuples:
                (h = (d = t.strictTuples) !== null && d !== void 0 ? d : K) !== null && h !== void 0 ? h : 'log',
            strictRequired:
                (f = (m = t.strictRequired) !== null && m !== void 0 ? m : K) !== null && f !== void 0 ? f : !1,
            code: t.code ? { ...t.code, optimize: Pe, regExp: pn } : { optimize: Pe, regExp: pn },
            loopRequired: (p = t.loopRequired) !== null && p !== void 0 ? p : Yo,
            loopEnum: (y = t.loopEnum) !== null && y !== void 0 ? y : Yo,
            meta: (g = t.meta) !== null && g !== void 0 ? g : !0,
            messages: ($ = t.messages) !== null && $ !== void 0 ? $ : !0,
            inlineRefs: (w = t.inlineRefs) !== null && w !== void 0 ? w : !0,
            schemaId: (b = t.schemaId) !== null && b !== void 0 ? b : '$id',
            addUsedSchema: (v = t.addUsedSchema) !== null && v !== void 0 ? v : !0,
            validateSchema: (q = t.validateSchema) !== null && q !== void 0 ? q : !0,
            validateFormats: (V = t.validateFormats) !== null && V !== void 0 ? V : !0,
            unicodeRegExp: (Se = t.unicodeRegExp) !== null && Se !== void 0 ? Se : !0,
            int32range: (le = t.int32range) !== null && le !== void 0 ? le : !0,
            uriResolver: pi,
        };
    }
    var kt = class {
        constructor(e = {}) {
            (this.schemas = {}),
                (this.refs = {}),
                (this.formats = {}),
                (this._compilations = new Set()),
                (this._loading = {}),
                (this._cache = new Map()),
                (e = this.opts = { ...e, ...Dl(e) });
            let { es5: r, lines: s } = this.opts.code;
            (this.scope = new kl.ValueScope({ scope: {}, prefixes: jl, es5: r, lines: s })),
                (this.logger = zl(e.logger));
            let n = e.validateFormats;
            (e.validateFormats = !1),
                (this.RULES = (0, Il.getRules)()),
                Qo.call(this, Al, e, 'NOT SUPPORTED'),
                Qo.call(this, Ml, e, 'DEPRECATED', 'warn'),
                (this._metaOpts = xl.call(this)),
                e.formats && Vl.call(this),
                this._addVocabularies(),
                this._addDefaultMetaSchema(),
                e.keywords && Kl.call(this, e.keywords),
                typeof e.meta == 'object' && this.addMetaSchema(e.meta),
                Ul.call(this),
                (e.validateFormats = n);
        }
        _addVocabularies() {
            this.addKeyword('$async');
        }
        _addDefaultMetaSchema() {
            let { $data: e, meta: r, schemaId: s } = this.opts,
                n = Wo;
            s === 'id' && ((n = { ...Wo }), (n.id = n.$id), delete n.$id), r && e && this.addMetaSchema(n, n[s], !1);
        }
        defaultMeta() {
            let { meta: e, schemaId: r } = this.opts;
            return (this.opts.defaultMeta = typeof e == 'object' ? e[r] || e : void 0);
        }
        validate(e, r) {
            let s;
            if (typeof e == 'string') {
                if (((s = this.getSchema(e)), !s)) throw new Error(`no schema with key or ref "${e}"`);
            } else s = this.compile(e);
            let n = s(r);
            return '$async' in s || (this.errors = s.errors), n;
        }
        compile(e, r) {
            let s = this._addSchema(e, r);
            return s.validate || this._compileSchemaEnv(s);
        }
        compileAsync(e, r) {
            if (typeof this.opts.loadSchema != 'function') throw new Error('options.loadSchema should be a function');
            let { loadSchema: s } = this.opts;
            return n.call(this, e, r);
            async function n(c, d) {
                await o.call(this, c.$schema);
                let h = this._addSchema(c, d);
                return h.validate || a.call(this, h);
            }
            async function o(c) {
                c && !this.getSchema(c) && (await n.call(this, { $ref: c }, !0));
            }
            async function a(c) {
                try {
                    return this._compileSchemaEnv(c);
                } catch (d) {
                    if (!(d instanceof Zo.default)) throw d;
                    return i.call(this, d), await l.call(this, d.missingSchema), a.call(this, c);
                }
            }
            function i({ missingSchema: c, missingRef: d }) {
                if (this.refs[c]) throw new Error(`AnySchema ${c} is loaded but ${d} cannot be resolved`);
            }
            async function l(c) {
                let d = await u.call(this, c);
                this.refs[c] || (await o.call(this, d.$schema)), this.refs[c] || this.addSchema(d, c, r);
            }
            async function u(c) {
                let d = this._loading[c];
                if (d) return d;
                try {
                    return await (this._loading[c] = s(c));
                } finally {
                    delete this._loading[c];
                }
            }
        }
        addSchema(e, r, s, n = this.opts.validateSchema) {
            if (Array.isArray(e)) {
                for (let a of e) this.addSchema(a, void 0, s, n);
                return this;
            }
            let o;
            if (typeof e == 'object') {
                let { schemaId: a } = this.opts;
                if (((o = e[a]), o !== void 0 && typeof o != 'string')) throw new Error(`schema ${a} must be string`);
            }
            return (
                (r = (0, It.normalizeId)(r || o)),
                this._checkUnique(r),
                (this.schemas[r] = this._addSchema(e, s, r, n, !0)),
                this
            );
        }
        addMetaSchema(e, r, s = this.opts.validateSchema) {
            return this.addSchema(e, r, !0, s), this;
        }
        validateSchema(e, r) {
            if (typeof e == 'boolean') return !0;
            let s;
            if (((s = e.$schema), s !== void 0 && typeof s != 'string')) throw new Error('$schema must be a string');
            if (((s = s || this.opts.defaultMeta || this.defaultMeta()), !s))
                return this.logger.warn('meta-schema not available'), (this.errors = null), !0;
            let n = this.validate(s, e);
            if (!n && r) {
                let o = `schema is invalid: ${this.errorsText()}`;
                if (this.opts.validateSchema === 'log') this.logger.error(o);
                else throw new Error(o);
            }
            return n;
        }
        getSchema(e) {
            let r;
            for (; typeof (r = Xo.call(this, e)) == 'string'; ) e = r;
            if (r === void 0) {
                let { schemaId: s } = this.opts,
                    n = new Tt.SchemaEnv({ schema: {}, schemaId: s });
                if (((r = Tt.resolveSchema.call(this, n, e)), !r)) return;
                this.refs[e] = r;
            }
            return r.validate || this._compileSchemaEnv(r);
        }
        removeSchema(e) {
            if (e instanceof RegExp)
                return this._removeAllSchemas(this.schemas, e), this._removeAllSchemas(this.refs, e), this;
            switch (typeof e) {
                case 'undefined':
                    return (
                        this._removeAllSchemas(this.schemas),
                        this._removeAllSchemas(this.refs),
                        this._cache.clear(),
                        this
                    );
                case 'string': {
                    let r = Xo.call(this, e);
                    return (
                        typeof r == 'object' && this._cache.delete(r.schema),
                        delete this.schemas[e],
                        delete this.refs[e],
                        this
                    );
                }
                case 'object': {
                    let r = e;
                    this._cache.delete(r);
                    let s = e[this.opts.schemaId];
                    return s && ((s = (0, It.normalizeId)(s)), delete this.schemas[s], delete this.refs[s]), this;
                }
                default:
                    throw new Error('ajv.removeSchema: invalid parameter');
            }
        }
        addVocabulary(e) {
            for (let r of e) this.addKeyword(r);
            return this;
        }
        addKeyword(e, r) {
            let s;
            if (typeof e == 'string')
                (s = e),
                    typeof r == 'object' &&
                        (this.logger.warn('these parameters are deprecated, see docs for addKeyword'), (r.keyword = s));
            else if (typeof e == 'object' && r === void 0) {
                if (((r = e), (s = r.keyword), Array.isArray(s) && !s.length))
                    throw new Error('addKeywords: keyword must be string or non-empty array');
            } else throw new Error('invalid addKeywords parameters');
            if ((Gl.call(this, s, r), !r)) return (0, Es.eachItem)(s, (o) => ws.call(this, o)), this;
            Bl.call(this, r);
            let n = { ...r, type: (0, lr.getJSONTypes)(r.type), schemaType: (0, lr.getJSONTypes)(r.schemaType) };
            return (
                (0, Es.eachItem)(
                    s,
                    n.type.length === 0
                        ? (o) => ws.call(this, o, n)
                        : (o) => n.type.forEach((a) => ws.call(this, o, n, a)),
                ),
                this
            );
        }
        getKeyword(e) {
            let r = this.RULES.all[e];
            return typeof r == 'object' ? r.definition : !!r;
        }
        removeKeyword(e) {
            let { RULES: r } = this;
            delete r.keywords[e], delete r.all[e];
            for (let s of r.rules) {
                let n = s.rules.findIndex((o) => o.keyword === e);
                n >= 0 && s.rules.splice(n, 1);
            }
            return this;
        }
        addFormat(e, r) {
            return typeof r == 'string' && (r = new RegExp(r)), (this.formats[e] = r), this;
        }
        errorsText(e = this.errors, { separator: r = ', ', dataVar: s = 'data' } = {}) {
            return !e || e.length === 0
                ? 'No errors'
                : e.map((n) => `${s}${n.instancePath} ${n.message}`).reduce((n, o) => n + r + o);
        }
        $dataMetaSchema(e, r) {
            let s = this.RULES.all;
            e = JSON.parse(JSON.stringify(e));
            for (let n of r) {
                let o = n.split('/').slice(1),
                    a = e;
                for (let i of o) a = a[i];
                for (let i in s) {
                    let l = s[i];
                    if (typeof l != 'object') continue;
                    let { $data: u } = l.definition,
                        c = a[i];
                    u && c && (a[i] = ta(c));
                }
            }
            return e;
        }
        _removeAllSchemas(e, r) {
            for (let s in e) {
                let n = e[s];
                (!r || r.test(s)) &&
                    (typeof n == 'string' ? delete e[s] : n && !n.meta && (this._cache.delete(n.schema), delete e[s]));
            }
        }
        _addSchema(e, r, s, n = this.opts.validateSchema, o = this.opts.addUsedSchema) {
            let a,
                { schemaId: i } = this.opts;
            if (typeof e == 'object') a = e[i];
            else {
                if (this.opts.jtd) throw new Error('schema must be object');
                if (typeof e != 'boolean') throw new Error('schema must be object or boolean');
            }
            let l = this._cache.get(e);
            if (l !== void 0) return l;
            s = (0, It.normalizeId)(a || s);
            let u = It.getSchemaRefs.call(this, e, s);
            return (
                (l = new Tt.SchemaEnv({ schema: e, schemaId: i, meta: r, baseId: s, localRefs: u })),
                this._cache.set(l.schema, l),
                o && !s.startsWith('#') && (s && this._checkUnique(s), (this.refs[s] = l)),
                n && this.validateSchema(e, !0),
                l
            );
        }
        _checkUnique(e) {
            if (this.schemas[e] || this.refs[e]) throw new Error(`schema with key or id "${e}" already exists`);
        }
        _compileSchemaEnv(e) {
            if ((e.meta ? this._compileMetaSchema(e) : Tt.compileSchema.call(this, e), !e.validate))
                throw new Error('ajv implementation error');
            return e.validate;
        }
        _compileMetaSchema(e) {
            let r = this.opts;
            this.opts = this._metaOpts;
            try {
                Tt.compileSchema.call(this, e);
            } finally {
                this.opts = r;
            }
        }
    };
    kt.ValidationError = Tl.default;
    kt.MissingRefError = Zo.default;
    x.default = kt;
    function Qo(t, e, r, s = 'error') {
        for (let n in t) {
            let o = n;
            o in e && this.logger[s](`${r}: option ${n}. ${t[o]}`);
        }
    }
    function Xo(t) {
        return (t = (0, It.normalizeId)(t)), this.schemas[t] || this.refs[t];
    }
    function Ul() {
        let t = this.opts.schemas;
        if (t)
            if (Array.isArray(t)) this.addSchema(t);
            else for (let e in t) this.addSchema(t[e], e);
    }
    function Vl() {
        for (let t in this.opts.formats) {
            let e = this.opts.formats[t];
            e && this.addFormat(t, e);
        }
    }
    function Kl(t) {
        if (Array.isArray(t)) {
            this.addVocabulary(t);
            return;
        }
        this.logger.warn('keywords option as map is deprecated, pass array');
        for (let e in t) {
            let r = t[e];
            r.keyword || (r.keyword = e), this.addKeyword(r);
        }
    }
    function xl() {
        let t = { ...this.opts };
        for (let e of ql) delete t[e];
        return t;
    }
    var Ll = { log() {}, warn() {}, error() {} };
    function zl(t) {
        if (t === !1) return Ll;
        if (t === void 0) return console;
        if (t.log && t.warn && t.error) return t;
        throw new Error('logger must implement log, warn and error methods');
    }
    var Fl = /^[a-z_$][a-z0-9_$:-]*$/i;
    function Gl(t, e) {
        let { RULES: r } = this;
        if (
            ((0, Es.eachItem)(t, (s) => {
                if (r.keywords[s]) throw new Error(`Keyword ${s} is already defined`);
                if (!Fl.test(s)) throw new Error(`Keyword ${s} has invalid name`);
            }),
            !!e && e.$data && !('code' in e || 'validate' in e))
        )
            throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ws(t, e, r) {
        var s;
        let n = e?.post;
        if (r && n) throw new Error('keyword with "post" flag cannot have "type"');
        let { RULES: o } = this,
            a = n ? o.post : o.rules.find(({ type: l }) => l === r);
        if ((a || ((a = { type: r, rules: [] }), o.rules.push(a)), (o.keywords[t] = !0), !e)) return;
        let i = {
            keyword: t,
            definition: { ...e, type: (0, lr.getJSONTypes)(e.type), schemaType: (0, lr.getJSONTypes)(e.schemaType) },
        };
        e.before ? Hl.call(this, a, i, e.before) : a.rules.push(i),
            (o.all[t] = i),
            (s = e.implements) === null || s === void 0 || s.forEach((l) => this.addKeyword(l));
    }
    function Hl(t, e, r) {
        let s = t.rules.findIndex((n) => n.keyword === r);
        s >= 0 ? t.rules.splice(s, 0, e) : (t.rules.push(e), this.logger.warn(`rule ${r} is not defined`));
    }
    function Bl(t) {
        let { metaSchema: e } = t;
        e !== void 0 && (t.$data && this.opts.$data && (e = ta(e)), (t.validateSchema = this.compile(e, !0)));
    }
    var Jl = { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' };
    function ta(t) {
        return { anyOf: [t, Jl] };
    }
});
var sa = _((bs) => {
    'use strict';
    Object.defineProperty(bs, '__esModule', { value: !0 });
    var Wl = {
        keyword: 'id',
        code() {
            throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
        },
    };
    bs.default = Wl;
});
var ia = _((ze) => {
    'use strict';
    Object.defineProperty(ze, '__esModule', { value: !0 });
    ze.callRef = ze.getValidate = void 0;
    var Yl = Ot(),
        na = se(),
        ee = O(),
        nt = we(),
        oa = ar(),
        dr = C(),
        Ql = {
            keyword: '$ref',
            schemaType: 'string',
            code(t) {
                let { gen: e, schema: r, it: s } = t,
                    { baseId: n, schemaEnv: o, validateName: a, opts: i, self: l } = s,
                    { root: u } = o;
                if ((r === '#' || r === '#/') && n === u.baseId) return d();
                let c = oa.resolveRef.call(l, u, n, r);
                if (c === void 0) throw new Yl.default(s.opts.uriResolver, n, r);
                if (c instanceof oa.SchemaEnv) return h(c);
                return m(c);
                function d() {
                    if (o === u) return fr(t, a, o, o.$async);
                    let f = e.scopeValue('root', { ref: u });
                    return fr(t, (0, ee._)`${f}.validate`, u, u.$async);
                }
                function h(f) {
                    let p = aa(t, f);
                    fr(t, p, f, f.$async);
                }
                function m(f) {
                    let p = e.scopeValue(
                            'schema',
                            i.code.source === !0 ? { ref: f, code: (0, ee.stringify)(f) } : { ref: f },
                        ),
                        y = e.name('valid'),
                        g = t.subschema(
                            { schema: f, dataTypes: [], schemaPath: ee.nil, topSchemaRef: p, errSchemaPath: r },
                            y,
                        );
                    t.mergeEvaluated(g), t.ok(y);
                }
            },
        };
    function aa(t, e) {
        let { gen: r } = t;
        return e.validate
            ? r.scopeValue('validate', { ref: e.validate })
            : (0, ee._)`${r.scopeValue('wrapper', { ref: e })}.validate`;
    }
    ze.getValidate = aa;
    function fr(t, e, r, s) {
        let { gen: n, it: o } = t,
            { allErrors: a, schemaEnv: i, opts: l } = o,
            u = l.passContext ? nt.default.this : ee.nil;
        s ? c() : d();
        function c() {
            if (!i.$async) throw new Error('async schema referenced by sync schema');
            let f = n.let('valid');
            n.try(
                () => {
                    n.code((0, ee._)`await ${(0, na.callValidateCode)(t, e, u)}`), m(e), a || n.assign(f, !0);
                },
                (p) => {
                    n.if((0, ee._)`!(${p} instanceof ${o.ValidationError})`, () => n.throw(p)),
                        h(p),
                        a || n.assign(f, !1);
                },
            ),
                t.ok(f);
        }
        function d() {
            t.result(
                (0, na.callValidateCode)(t, e, u),
                () => m(e),
                () => h(e),
            );
        }
        function h(f) {
            let p = (0, ee._)`${f}.errors`;
            n.assign(
                nt.default.vErrors,
                (0, ee._)`${nt.default.vErrors} === null ? ${p} : ${nt.default.vErrors}.concat(${p})`,
            ),
                n.assign(nt.default.errors, (0, ee._)`${nt.default.vErrors}.length`);
        }
        function m(f) {
            var p;
            if (!o.opts.unevaluated) return;
            let y = (p = r?.validate) === null || p === void 0 ? void 0 : p.evaluated;
            if (o.props !== !0)
                if (y && !y.dynamicProps)
                    y.props !== void 0 && (o.props = dr.mergeEvaluated.props(n, y.props, o.props));
                else {
                    let g = n.var('props', (0, ee._)`${f}.evaluated.props`);
                    o.props = dr.mergeEvaluated.props(n, g, o.props, ee.Name);
                }
            if (o.items !== !0)
                if (y && !y.dynamicItems)
                    y.items !== void 0 && (o.items = dr.mergeEvaluated.items(n, y.items, o.items));
                else {
                    let g = n.var('items', (0, ee._)`${f}.evaluated.items`);
                    o.items = dr.mergeEvaluated.items(n, g, o.items, ee.Name);
                }
        }
    }
    ze.callRef = fr;
    ze.default = Ql;
});
var ca = _((Ss) => {
    'use strict';
    Object.defineProperty(Ss, '__esModule', { value: !0 });
    var Xl = sa(),
        Zl = ia(),
        ed = ['$schema', '$id', '$defs', '$vocabulary', { keyword: '$comment' }, 'definitions', Xl.default, Zl.default];
    Ss.default = ed;
});
var ua = _((Ps) => {
    'use strict';
    Object.defineProperty(Ps, '__esModule', { value: !0 });
    var pr = O(),
        qe = pr.operators,
        hr = {
            maximum: { okStr: '<=', ok: qe.LTE, fail: qe.GT },
            minimum: { okStr: '>=', ok: qe.GTE, fail: qe.LT },
            exclusiveMaximum: { okStr: '<', ok: qe.LT, fail: qe.GTE },
            exclusiveMinimum: { okStr: '>', ok: qe.GT, fail: qe.LTE },
        },
        td = {
            message: ({ keyword: t, schemaCode: e }) => (0, pr.str)`must be ${hr[t].okStr} ${e}`,
            params: ({ keyword: t, schemaCode: e }) => (0, pr._)`{comparison: ${hr[t].okStr}, limit: ${e}}`,
        },
        rd = {
            keyword: Object.keys(hr),
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: td,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t;
                t.fail$data((0, pr._)`${r} ${hr[e].fail} ${s} || isNaN(${r})`);
            },
        };
    Ps.default = rd;
});
var la = _((Ns) => {
    'use strict';
    Object.defineProperty(Ns, '__esModule', { value: !0 });
    var Ct = O(),
        sd = {
            message: ({ schemaCode: t }) => (0, Ct.str)`must be multiple of ${t}`,
            params: ({ schemaCode: t }) => (0, Ct._)`{multipleOf: ${t}}`,
        },
        nd = {
            keyword: 'multipleOf',
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: sd,
            code(t) {
                let { gen: e, data: r, schemaCode: s, it: n } = t,
                    o = n.opts.multipleOfPrecision,
                    a = e.let('res'),
                    i = o ? (0, Ct._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, Ct._)`${a} !== parseInt(${a})`;
                t.fail$data((0, Ct._)`(${s} === 0 || (${a} = ${r}/${s}, ${i}))`);
            },
        };
    Ns.default = nd;
});
var fa = _((Os) => {
    'use strict';
    Object.defineProperty(Os, '__esModule', { value: !0 });
    function da(t) {
        let e = t.length,
            r = 0,
            s = 0,
            n;
        for (; s < e; )
            r++,
                (n = t.charCodeAt(s++)),
                n >= 55296 && n <= 56319 && s < e && ((n = t.charCodeAt(s)), (n & 64512) === 56320 && s++);
        return r;
    }
    Os.default = da;
    da.code = 'require("ajv/dist/runtime/ucs2length").default';
});
var pa = _((Rs) => {
    'use strict';
    Object.defineProperty(Rs, '__esModule', { value: !0 });
    var Fe = O(),
        od = C(),
        ad = fa(),
        id = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxLength' ? 'more' : 'fewer';
                return (0, Fe.str)`must NOT have ${r} than ${e} characters`;
            },
            params: ({ schemaCode: t }) => (0, Fe._)`{limit: ${t}}`,
        },
        cd = {
            keyword: ['maxLength', 'minLength'],
            type: 'string',
            schemaType: 'number',
            $data: !0,
            error: id,
            code(t) {
                let { keyword: e, data: r, schemaCode: s, it: n } = t,
                    o = e === 'maxLength' ? Fe.operators.GT : Fe.operators.LT,
                    a =
                        n.opts.unicode === !1
                            ? (0, Fe._)`${r}.length`
                            : (0, Fe._)`${(0, od.useFunc)(t.gen, ad.default)}(${r})`;
                t.fail$data((0, Fe._)`${a} ${o} ${s}`);
            },
        };
    Rs.default = cd;
});
var ha = _((Ts) => {
    'use strict';
    Object.defineProperty(Ts, '__esModule', { value: !0 });
    var ud = se(),
        mr = O(),
        ld = {
            message: ({ schemaCode: t }) => (0, mr.str)`must match pattern "${t}"`,
            params: ({ schemaCode: t }) => (0, mr._)`{pattern: ${t}}`,
        },
        dd = {
            keyword: 'pattern',
            type: 'string',
            schemaType: 'string',
            $data: !0,
            error: ld,
            code(t) {
                let { data: e, $data: r, schema: s, schemaCode: n, it: o } = t,
                    a = o.opts.unicodeRegExp ? 'u' : '',
                    i = r ? (0, mr._)`(new RegExp(${n}, ${a}))` : (0, ud.usePattern)(t, s);
                t.fail$data((0, mr._)`!${i}.test(${e})`);
            },
        };
    Ts.default = dd;
});
var ma = _((Is) => {
    'use strict';
    Object.defineProperty(Is, '__esModule', { value: !0 });
    var qt = O(),
        fd = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxProperties' ? 'more' : 'fewer';
                return (0, qt.str)`must NOT have ${r} than ${e} properties`;
            },
            params: ({ schemaCode: t }) => (0, qt._)`{limit: ${t}}`,
        },
        pd = {
            keyword: ['maxProperties', 'minProperties'],
            type: 'object',
            schemaType: 'number',
            $data: !0,
            error: fd,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxProperties' ? qt.operators.GT : qt.operators.LT;
                t.fail$data((0, qt._)`Object.keys(${r}).length ${n} ${s}`);
            },
        };
    Is.default = pd;
});
var ya = _((ks) => {
    'use strict';
    Object.defineProperty(ks, '__esModule', { value: !0 });
    var jt = se(),
        At = O(),
        hd = C(),
        md = {
            message: ({ params: { missingProperty: t } }) => (0, At.str)`must have required property '${t}'`,
            params: ({ params: { missingProperty: t } }) => (0, At._)`{missingProperty: ${t}}`,
        },
        yd = {
            keyword: 'required',
            type: 'object',
            schemaType: 'array',
            $data: !0,
            error: md,
            code(t) {
                let { gen: e, schema: r, schemaCode: s, data: n, $data: o, it: a } = t,
                    { opts: i } = a;
                if (!o && r.length === 0) return;
                let l = r.length >= i.loopRequired;
                if ((a.allErrors ? u() : c(), i.strictRequired)) {
                    let m = t.parentSchema.properties,
                        { definedProperties: f } = t.it;
                    for (let p of r)
                        if (m?.[p] === void 0 && !f.has(p)) {
                            let y = a.schemaEnv.baseId + a.errSchemaPath,
                                g = `required property "${p}" is not defined at "${y}" (strictRequired)`;
                            (0, hd.checkStrictMode)(a, g, a.opts.strictRequired);
                        }
                }
                function u() {
                    if (l || o) t.block$data(At.nil, d);
                    else for (let m of r) (0, jt.checkReportMissingProp)(t, m);
                }
                function c() {
                    let m = e.let('missing');
                    if (l || o) {
                        let f = e.let('valid', !0);
                        t.block$data(f, () => h(m, f)), t.ok(f);
                    } else e.if((0, jt.checkMissingProp)(t, r, m)), (0, jt.reportMissingProp)(t, m), e.else();
                }
                function d() {
                    e.forOf('prop', s, (m) => {
                        t.setParams({ missingProperty: m }),
                            e.if((0, jt.noPropertyInData)(e, n, m, i.ownProperties), () => t.error());
                    });
                }
                function h(m, f) {
                    t.setParams({ missingProperty: m }),
                        e.forOf(
                            m,
                            s,
                            () => {
                                e.assign(f, (0, jt.propertyInData)(e, n, m, i.ownProperties)),
                                    e.if((0, At.not)(f), () => {
                                        t.error(), e.break();
                                    });
                            },
                            At.nil,
                        );
                }
            },
        };
    ks.default = yd;
});
var ga = _((Cs) => {
    'use strict';
    Object.defineProperty(Cs, '__esModule', { value: !0 });
    var Mt = O(),
        gd = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxItems' ? 'more' : 'fewer';
                return (0, Mt.str)`must NOT have ${r} than ${e} items`;
            },
            params: ({ schemaCode: t }) => (0, Mt._)`{limit: ${t}}`,
        },
        _d = {
            keyword: ['maxItems', 'minItems'],
            type: 'array',
            schemaType: 'number',
            $data: !0,
            error: gd,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxItems' ? Mt.operators.GT : Mt.operators.LT;
                t.fail$data((0, Mt._)`${r}.length ${n} ${s}`);
            },
        };
    Cs.default = _d;
});
var yr = _((qs) => {
    'use strict';
    Object.defineProperty(qs, '__esModule', { value: !0 });
    var _a = ns();
    _a.code = 'require("ajv/dist/runtime/equal").default';
    qs.default = _a;
});
var $a = _((As) => {
    'use strict';
    Object.defineProperty(As, '__esModule', { value: !0 });
    var js = Et(),
        L = O(),
        $d = C(),
        vd = yr(),
        wd = {
            message: ({ params: { i: t, j: e } }) =>
                (0, L.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
            params: ({ params: { i: t, j: e } }) => (0, L._)`{i: ${t}, j: ${e}}`,
        },
        Ed = {
            keyword: 'uniqueItems',
            type: 'array',
            schemaType: 'boolean',
            $data: !0,
            error: wd,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, parentSchema: o, schemaCode: a, it: i } = t;
                if (!s && !n) return;
                let l = e.let('valid'),
                    u = o.items ? (0, js.getSchemaTypes)(o.items) : [];
                t.block$data(l, c, (0, L._)`${a} === false`), t.ok(l);
                function c() {
                    let f = e.let('i', (0, L._)`${r}.length`),
                        p = e.let('j');
                    t.setParams({ i: f, j: p }), e.assign(l, !0), e.if((0, L._)`${f} > 1`, () => (d() ? h : m)(f, p));
                }
                function d() {
                    return u.length > 0 && !u.some((f) => f === 'object' || f === 'array');
                }
                function h(f, p) {
                    let y = e.name('item'),
                        g = (0, js.checkDataTypes)(u, y, i.opts.strictNumbers, js.DataType.Wrong),
                        $ = e.const('indices', (0, L._)`{}`);
                    e.for((0, L._)`;${f}--;`, () => {
                        e.let(y, (0, L._)`${r}[${f}]`),
                            e.if(g, (0, L._)`continue`),
                            u.length > 1 && e.if((0, L._)`typeof ${y} == "string"`, (0, L._)`${y} += "_"`),
                            e
                                .if((0, L._)`typeof ${$}[${y}] == "number"`, () => {
                                    e.assign(p, (0, L._)`${$}[${y}]`), t.error(), e.assign(l, !1).break();
                                })
                                .code((0, L._)`${$}[${y}] = ${f}`);
                    });
                }
                function m(f, p) {
                    let y = (0, $d.useFunc)(e, vd.default),
                        g = e.name('outer');
                    e.label(g).for((0, L._)`;${f}--;`, () =>
                        e.for((0, L._)`${p} = ${f}; ${p}--;`, () =>
                            e.if((0, L._)`${y}(${r}[${f}], ${r}[${p}])`, () => {
                                t.error(), e.assign(l, !1).break(g);
                            }),
                        ),
                    );
                }
            },
        };
    As.default = Ed;
});
var va = _((Ds) => {
    'use strict';
    Object.defineProperty(Ds, '__esModule', { value: !0 });
    var Ms = O(),
        bd = C(),
        Sd = yr(),
        Pd = { message: 'must be equal to constant', params: ({ schemaCode: t }) => (0, Ms._)`{allowedValue: ${t}}` },
        Nd = {
            keyword: 'const',
            $data: !0,
            error: Pd,
            code(t) {
                let { gen: e, data: r, $data: s, schemaCode: n, schema: o } = t;
                s || (o && typeof o == 'object')
                    ? t.fail$data((0, Ms._)`!${(0, bd.useFunc)(e, Sd.default)}(${r}, ${n})`)
                    : t.fail((0, Ms._)`${o} !== ${r}`);
            },
        };
    Ds.default = Nd;
});
var wa = _((Us) => {
    'use strict';
    Object.defineProperty(Us, '__esModule', { value: !0 });
    var Dt = O(),
        Od = C(),
        Rd = yr(),
        Td = {
            message: 'must be equal to one of the allowed values',
            params: ({ schemaCode: t }) => (0, Dt._)`{allowedValues: ${t}}`,
        },
        Id = {
            keyword: 'enum',
            schemaType: 'array',
            $data: !0,
            error: Td,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, schemaCode: o, it: a } = t;
                if (!s && n.length === 0) throw new Error('enum must have non-empty array');
                let i = n.length >= a.opts.loopEnum,
                    l,
                    u = () => l ?? (l = (0, Od.useFunc)(e, Rd.default)),
                    c;
                if (i || s) (c = e.let('valid')), t.block$data(c, d);
                else {
                    if (!Array.isArray(n)) throw new Error('ajv implementation error');
                    let m = e.const('vSchema', o);
                    c = (0, Dt.or)(...n.map((f, p) => h(m, p)));
                }
                t.pass(c);
                function d() {
                    e.assign(c, !1),
                        e.forOf('v', o, (m) => e.if((0, Dt._)`${u()}(${r}, ${m})`, () => e.assign(c, !0).break()));
                }
                function h(m, f) {
                    let p = n[f];
                    return typeof p == 'object' && p !== null
                        ? (0, Dt._)`${u()}(${r}, ${m}[${f}])`
                        : (0, Dt._)`${r} === ${p}`;
                }
            },
        };
    Us.default = Id;
});
var Ea = _((Vs) => {
    'use strict';
    Object.defineProperty(Vs, '__esModule', { value: !0 });
    var kd = ua(),
        Cd = la(),
        qd = pa(),
        jd = ha(),
        Ad = ma(),
        Md = ya(),
        Dd = ga(),
        Ud = $a(),
        Vd = va(),
        Kd = wa(),
        xd = [
            kd.default,
            Cd.default,
            qd.default,
            jd.default,
            Ad.default,
            Md.default,
            Dd.default,
            Ud.default,
            { keyword: 'type', schemaType: ['string', 'array'] },
            { keyword: 'nullable', schemaType: 'boolean' },
            Vd.default,
            Kd.default,
        ];
    Vs.default = xd;
});
var xs = _((Ut) => {
    'use strict';
    Object.defineProperty(Ut, '__esModule', { value: !0 });
    Ut.validateAdditionalItems = void 0;
    var Ge = O(),
        Ks = C(),
        Ld = {
            message: ({ params: { len: t } }) => (0, Ge.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, Ge._)`{limit: ${t}}`,
        },
        zd = {
            keyword: 'additionalItems',
            type: 'array',
            schemaType: ['boolean', 'object'],
            before: 'uniqueItems',
            error: Ld,
            code(t) {
                let { parentSchema: e, it: r } = t,
                    { items: s } = e;
                if (!Array.isArray(s)) {
                    (0, Ks.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return;
                }
                ba(t, s);
            },
        };
    function ba(t, e) {
        let { gen: r, schema: s, data: n, keyword: o, it: a } = t;
        a.items = !0;
        let i = r.const('len', (0, Ge._)`${n}.length`);
        if (s === !1) t.setParams({ len: e.length }), t.pass((0, Ge._)`${i} <= ${e.length}`);
        else if (typeof s == 'object' && !(0, Ks.alwaysValidSchema)(a, s)) {
            let u = r.var('valid', (0, Ge._)`${i} <= ${e.length}`);
            r.if((0, Ge.not)(u), () => l(u)), t.ok(u);
        }
        function l(u) {
            r.forRange('i', e.length, i, (c) => {
                t.subschema({ keyword: o, dataProp: c, dataPropType: Ks.Type.Num }, u),
                    a.allErrors || r.if((0, Ge.not)(u), () => r.break());
            });
        }
    }
    Ut.validateAdditionalItems = ba;
    Ut.default = zd;
});
var Ls = _((Vt) => {
    'use strict';
    Object.defineProperty(Vt, '__esModule', { value: !0 });
    Vt.validateTuple = void 0;
    var Sa = O(),
        gr = C(),
        Fd = se(),
        Gd = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'array', 'boolean'],
            before: 'uniqueItems',
            code(t) {
                let { schema: e, it: r } = t;
                if (Array.isArray(e)) return Pa(t, 'additionalItems', e);
                (r.items = !0), !(0, gr.alwaysValidSchema)(r, e) && t.ok((0, Fd.validateArray)(t));
            },
        };
    function Pa(t, e, r = t.schema) {
        let { gen: s, parentSchema: n, data: o, keyword: a, it: i } = t;
        c(n),
            i.opts.unevaluated &&
                r.length &&
                i.items !== !0 &&
                (i.items = gr.mergeEvaluated.items(s, r.length, i.items));
        let l = s.name('valid'),
            u = s.const('len', (0, Sa._)`${o}.length`);
        r.forEach((d, h) => {
            (0, gr.alwaysValidSchema)(i, d) ||
                (s.if((0, Sa._)`${u} > ${h}`, () => t.subschema({ keyword: a, schemaProp: h, dataProp: h }, l)),
                t.ok(l));
        });
        function c(d) {
            let { opts: h, errSchemaPath: m } = i,
                f = r.length,
                p = f === d.minItems && (f === d.maxItems || d[e] === !1);
            if (h.strictTuples && !p) {
                let y = `"${a}" is ${f}-tuple, but minItems or maxItems/${e} are not specified or different at path "${m}"`;
                (0, gr.checkStrictMode)(i, y, h.strictTuples);
            }
        }
    }
    Vt.validateTuple = Pa;
    Vt.default = Gd;
});
var Na = _((zs) => {
    'use strict';
    Object.defineProperty(zs, '__esModule', { value: !0 });
    var Hd = Ls(),
        Bd = {
            keyword: 'prefixItems',
            type: 'array',
            schemaType: ['array'],
            before: 'uniqueItems',
            code: (t) => (0, Hd.validateTuple)(t, 'items'),
        };
    zs.default = Bd;
});
var Ra = _((Fs) => {
    'use strict';
    Object.defineProperty(Fs, '__esModule', { value: !0 });
    var Oa = O(),
        Jd = C(),
        Wd = se(),
        Yd = xs(),
        Qd = {
            message: ({ params: { len: t } }) => (0, Oa.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, Oa._)`{limit: ${t}}`,
        },
        Xd = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            error: Qd,
            code(t) {
                let { schema: e, parentSchema: r, it: s } = t,
                    { prefixItems: n } = r;
                (s.items = !0),
                    !(0, Jd.alwaysValidSchema)(s, e) &&
                        (n ? (0, Yd.validateAdditionalItems)(t, n) : t.ok((0, Wd.validateArray)(t)));
            },
        };
    Fs.default = Xd;
});
var Ta = _((Gs) => {
    'use strict';
    Object.defineProperty(Gs, '__esModule', { value: !0 });
    var oe = O(),
        _r = C(),
        Zd = {
            message: ({ params: { min: t, max: e } }) =>
                e === void 0
                    ? (0, oe.str)`must contain at least ${t} valid item(s)`
                    : (0, oe.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
            params: ({ params: { min: t, max: e } }) =>
                e === void 0 ? (0, oe._)`{minContains: ${t}}` : (0, oe._)`{minContains: ${t}, maxContains: ${e}}`,
        },
        ef = {
            keyword: 'contains',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            trackErrors: !0,
            error: Zd,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t,
                    a,
                    i,
                    { minContains: l, maxContains: u } = s;
                o.opts.next ? ((a = l === void 0 ? 1 : l), (i = u)) : (a = 1);
                let c = e.const('len', (0, oe._)`${n}.length`);
                if ((t.setParams({ min: a, max: i }), i === void 0 && a === 0)) {
                    (0, _r.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return;
                }
                if (i !== void 0 && a > i) {
                    (0, _r.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), t.fail();
                    return;
                }
                if ((0, _r.alwaysValidSchema)(o, r)) {
                    let p = (0, oe._)`${c} >= ${a}`;
                    i !== void 0 && (p = (0, oe._)`${p} && ${c} <= ${i}`), t.pass(p);
                    return;
                }
                o.items = !0;
                let d = e.name('valid');
                i === void 0 && a === 1
                    ? m(d, () => e.if(d, () => e.break()))
                    : a === 0
                      ? (e.let(d, !0), i !== void 0 && e.if((0, oe._)`${n}.length > 0`, h))
                      : (e.let(d, !1), h()),
                    t.result(d, () => t.reset());
                function h() {
                    let p = e.name('_valid'),
                        y = e.let('count', 0);
                    m(p, () => e.if(p, () => f(y)));
                }
                function m(p, y) {
                    e.forRange('i', 0, c, (g) => {
                        t.subschema(
                            { keyword: 'contains', dataProp: g, dataPropType: _r.Type.Num, compositeRule: !0 },
                            p,
                        ),
                            y();
                    });
                }
                function f(p) {
                    e.code((0, oe._)`${p}++`),
                        i === void 0
                            ? e.if((0, oe._)`${p} >= ${a}`, () => e.assign(d, !0).break())
                            : (e.if((0, oe._)`${p} > ${i}`, () => e.assign(d, !1).break()),
                              a === 1 ? e.assign(d, !0) : e.if((0, oe._)`${p} >= ${a}`, () => e.assign(d, !0)));
                }
            },
        };
    Gs.default = ef;
});
var Ca = _((_e) => {
    'use strict';
    Object.defineProperty(_e, '__esModule', { value: !0 });
    _e.validateSchemaDeps = _e.validatePropertyDeps = _e.error = void 0;
    var Hs = O(),
        tf = C(),
        Kt = se();
    _e.error = {
        message: ({ params: { property: t, depsCount: e, deps: r } }) => {
            let s = e === 1 ? 'property' : 'properties';
            return (0, Hs.str)`must have ${s} ${r} when property ${t} is present`;
        },
        params: ({ params: { property: t, depsCount: e, deps: r, missingProperty: s } }) => (0, Hs._)`{property: ${t},
    missingProperty: ${s},
    depsCount: ${e},
    deps: ${r}}`,
    };
    var rf = {
        keyword: 'dependencies',
        type: 'object',
        schemaType: 'object',
        error: _e.error,
        code(t) {
            let [e, r] = sf(t);
            Ia(t, e), ka(t, r);
        },
    };
    function sf({ schema: t }) {
        let e = {},
            r = {};
        for (let s in t) {
            if (s === '__proto__') continue;
            let n = Array.isArray(t[s]) ? e : r;
            n[s] = t[s];
        }
        return [e, r];
    }
    function Ia(t, e = t.schema) {
        let { gen: r, data: s, it: n } = t;
        if (Object.keys(e).length === 0) return;
        let o = r.let('missing');
        for (let a in e) {
            let i = e[a];
            if (i.length === 0) continue;
            let l = (0, Kt.propertyInData)(r, s, a, n.opts.ownProperties);
            t.setParams({ property: a, depsCount: i.length, deps: i.join(', ') }),
                n.allErrors
                    ? r.if(l, () => {
                          for (let u of i) (0, Kt.checkReportMissingProp)(t, u);
                      })
                    : (r.if((0, Hs._)`${l} && (${(0, Kt.checkMissingProp)(t, i, o)})`),
                      (0, Kt.reportMissingProp)(t, o),
                      r.else());
        }
    }
    _e.validatePropertyDeps = Ia;
    function ka(t, e = t.schema) {
        let { gen: r, data: s, keyword: n, it: o } = t,
            a = r.name('valid');
        for (let i in e)
            (0, tf.alwaysValidSchema)(o, e[i]) ||
                (r.if(
                    (0, Kt.propertyInData)(r, s, i, o.opts.ownProperties),
                    () => {
                        let l = t.subschema({ keyword: n, schemaProp: i }, a);
                        t.mergeValidEvaluated(l, a);
                    },
                    () => r.var(a, !0),
                ),
                t.ok(a));
    }
    _e.validateSchemaDeps = ka;
    _e.default = rf;
});
var ja = _((Bs) => {
    'use strict';
    Object.defineProperty(Bs, '__esModule', { value: !0 });
    var qa = O(),
        nf = C(),
        of = {
            message: 'property name must be valid',
            params: ({ params: t }) => (0, qa._)`{propertyName: ${t.propertyName}}`,
        },
        af = {
            keyword: 'propertyNames',
            type: 'object',
            schemaType: ['object', 'boolean'],
            error: of,
            code(t) {
                let { gen: e, schema: r, data: s, it: n } = t;
                if ((0, nf.alwaysValidSchema)(n, r)) return;
                let o = e.name('valid');
                e.forIn('key', s, (a) => {
                    t.setParams({ propertyName: a }),
                        t.subschema(
                            {
                                keyword: 'propertyNames',
                                data: a,
                                dataTypes: ['string'],
                                propertyName: a,
                                compositeRule: !0,
                            },
                            o,
                        ),
                        e.if((0, qa.not)(o), () => {
                            t.error(!0), n.allErrors || e.break();
                        });
                }),
                    t.ok(o);
            },
        };
    Bs.default = af;
});
var Ws = _((Js) => {
    'use strict';
    Object.defineProperty(Js, '__esModule', { value: !0 });
    var $r = se(),
        ue = O(),
        cf = we(),
        vr = C(),
        uf = {
            message: 'must NOT have additional properties',
            params: ({ params: t }) => (0, ue._)`{additionalProperty: ${t.additionalProperty}}`,
        },
        lf = {
            keyword: 'additionalProperties',
            type: ['object'],
            schemaType: ['boolean', 'object'],
            allowUndefined: !0,
            trackErrors: !0,
            error: uf,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, errsCount: o, it: a } = t;
                if (!o) throw new Error('ajv implementation error');
                let { allErrors: i, opts: l } = a;
                if (((a.props = !0), l.removeAdditional !== 'all' && (0, vr.alwaysValidSchema)(a, r))) return;
                let u = (0, $r.allSchemaProperties)(s.properties),
                    c = (0, $r.allSchemaProperties)(s.patternProperties);
                d(), t.ok((0, ue._)`${o} === ${cf.default.errors}`);
                function d() {
                    e.forIn('key', n, (y) => {
                        !u.length && !c.length ? f(y) : e.if(h(y), () => f(y));
                    });
                }
                function h(y) {
                    let g;
                    if (u.length > 8) {
                        let $ = (0, vr.schemaRefOrVal)(a, s.properties, 'properties');
                        g = (0, $r.isOwnProperty)(e, $, y);
                    } else u.length ? (g = (0, ue.or)(...u.map(($) => (0, ue._)`${y} === ${$}`))) : (g = ue.nil);
                    return (
                        c.length &&
                            (g = (0, ue.or)(g, ...c.map(($) => (0, ue._)`${(0, $r.usePattern)(t, $)}.test(${y})`))),
                        (0, ue.not)(g)
                    );
                }
                function m(y) {
                    e.code((0, ue._)`delete ${n}[${y}]`);
                }
                function f(y) {
                    if (l.removeAdditional === 'all' || (l.removeAdditional && r === !1)) {
                        m(y);
                        return;
                    }
                    if (r === !1) {
                        t.setParams({ additionalProperty: y }), t.error(), i || e.break();
                        return;
                    }
                    if (typeof r == 'object' && !(0, vr.alwaysValidSchema)(a, r)) {
                        let g = e.name('valid');
                        l.removeAdditional === 'failing'
                            ? (p(y, g, !1),
                              e.if((0, ue.not)(g), () => {
                                  t.reset(), m(y);
                              }))
                            : (p(y, g), i || e.if((0, ue.not)(g), () => e.break()));
                    }
                }
                function p(y, g, $) {
                    let w = { keyword: 'additionalProperties', dataProp: y, dataPropType: vr.Type.Str };
                    $ === !1 && Object.assign(w, { compositeRule: !0, createErrors: !1, allErrors: !1 }),
                        t.subschema(w, g);
                }
            },
        };
    Js.default = lf;
});
var Da = _((Qs) => {
    'use strict';
    Object.defineProperty(Qs, '__esModule', { value: !0 });
    var df = Nt(),
        Aa = se(),
        Ys = C(),
        Ma = Ws(),
        ff = {
            keyword: 'properties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t;
                o.opts.removeAdditional === 'all' &&
                    s.additionalProperties === void 0 &&
                    Ma.default.code(new df.KeywordCxt(o, Ma.default, 'additionalProperties'));
                let a = (0, Aa.allSchemaProperties)(r);
                for (let d of a) o.definedProperties.add(d);
                o.opts.unevaluated &&
                    a.length &&
                    o.props !== !0 &&
                    (o.props = Ys.mergeEvaluated.props(e, (0, Ys.toHash)(a), o.props));
                let i = a.filter((d) => !(0, Ys.alwaysValidSchema)(o, r[d]));
                if (i.length === 0) return;
                let l = e.name('valid');
                for (let d of i)
                    u(d)
                        ? c(d)
                        : (e.if((0, Aa.propertyInData)(e, n, d, o.opts.ownProperties)),
                          c(d),
                          o.allErrors || e.else().var(l, !0),
                          e.endIf()),
                        t.it.definedProperties.add(d),
                        t.ok(l);
                function u(d) {
                    return o.opts.useDefaults && !o.compositeRule && r[d].default !== void 0;
                }
                function c(d) {
                    t.subschema({ keyword: 'properties', schemaProp: d, dataProp: d }, l);
                }
            },
        };
    Qs.default = ff;
});
var xa = _((Xs) => {
    'use strict';
    Object.defineProperty(Xs, '__esModule', { value: !0 });
    var Ua = se(),
        wr = O(),
        Va = C(),
        Ka = C(),
        pf = {
            keyword: 'patternProperties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, data: s, parentSchema: n, it: o } = t,
                    { opts: a } = o,
                    i = (0, Ua.allSchemaProperties)(r),
                    l = i.filter((p) => (0, Va.alwaysValidSchema)(o, r[p]));
                if (i.length === 0 || (l.length === i.length && (!o.opts.unevaluated || o.props === !0))) return;
                let u = a.strictSchema && !a.allowMatchingProperties && n.properties,
                    c = e.name('valid');
                o.props !== !0 && !(o.props instanceof wr.Name) && (o.props = (0, Ka.evaluatedPropsToName)(e, o.props));
                let { props: d } = o;
                h();
                function h() {
                    for (let p of i) u && m(p), o.allErrors ? f(p) : (e.var(c, !0), f(p), e.if(c));
                }
                function m(p) {
                    for (let y in u)
                        new RegExp(p).test(y) &&
                            (0, Va.checkStrictMode)(
                                o,
                                `property ${y} matches pattern ${p} (use allowMatchingProperties)`,
                            );
                }
                function f(p) {
                    e.forIn('key', s, (y) => {
                        e.if((0, wr._)`${(0, Ua.usePattern)(t, p)}.test(${y})`, () => {
                            let g = l.includes(p);
                            g ||
                                t.subschema(
                                    {
                                        keyword: 'patternProperties',
                                        schemaProp: p,
                                        dataProp: y,
                                        dataPropType: Ka.Type.Str,
                                    },
                                    c,
                                ),
                                o.opts.unevaluated && d !== !0
                                    ? e.assign((0, wr._)`${d}[${y}]`, !0)
                                    : !g && !o.allErrors && e.if((0, wr.not)(c), () => e.break());
                        });
                    });
                }
            },
        };
    Xs.default = pf;
});
var La = _((Zs) => {
    'use strict';
    Object.defineProperty(Zs, '__esModule', { value: !0 });
    var hf = C(),
        mf = {
            keyword: 'not',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if ((0, hf.alwaysValidSchema)(s, r)) {
                    t.fail();
                    return;
                }
                let n = e.name('valid');
                t.subschema({ keyword: 'not', compositeRule: !0, createErrors: !1, allErrors: !1 }, n),
                    t.failResult(
                        n,
                        () => t.reset(),
                        () => t.error(),
                    );
            },
            error: { message: 'must NOT be valid' },
        };
    Zs.default = mf;
});
var za = _((en) => {
    'use strict';
    Object.defineProperty(en, '__esModule', { value: !0 });
    var yf = se(),
        gf = {
            keyword: 'anyOf',
            schemaType: 'array',
            trackErrors: !0,
            code: yf.validateUnion,
            error: { message: 'must match a schema in anyOf' },
        };
    en.default = gf;
});
var Fa = _((tn) => {
    'use strict';
    Object.defineProperty(tn, '__esModule', { value: !0 });
    var Er = O(),
        _f = C(),
        $f = {
            message: 'must match exactly one schema in oneOf',
            params: ({ params: t }) => (0, Er._)`{passingSchemas: ${t.passing}}`,
        },
        vf = {
            keyword: 'oneOf',
            schemaType: 'array',
            trackErrors: !0,
            error: $f,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, it: n } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                if (n.opts.discriminator && s.discriminator) return;
                let o = r,
                    a = e.let('valid', !1),
                    i = e.let('passing', null),
                    l = e.name('_valid');
                t.setParams({ passing: i }),
                    e.block(u),
                    t.result(
                        a,
                        () => t.reset(),
                        () => t.error(!0),
                    );
                function u() {
                    o.forEach((c, d) => {
                        let h;
                        (0, _f.alwaysValidSchema)(n, c)
                            ? e.var(l, !0)
                            : (h = t.subschema({ keyword: 'oneOf', schemaProp: d, compositeRule: !0 }, l)),
                            d > 0 &&
                                e
                                    .if((0, Er._)`${l} && ${a}`)
                                    .assign(a, !1)
                                    .assign(i, (0, Er._)`[${i}, ${d}]`)
                                    .else(),
                            e.if(l, () => {
                                e.assign(a, !0), e.assign(i, d), h && t.mergeEvaluated(h, Er.Name);
                            });
                    });
                }
            },
        };
    tn.default = vf;
});
var Ga = _((rn) => {
    'use strict';
    Object.defineProperty(rn, '__esModule', { value: !0 });
    var wf = C(),
        Ef = {
            keyword: 'allOf',
            schemaType: 'array',
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                let n = e.name('valid');
                r.forEach((o, a) => {
                    if ((0, wf.alwaysValidSchema)(s, o)) return;
                    let i = t.subschema({ keyword: 'allOf', schemaProp: a }, n);
                    t.ok(n), t.mergeEvaluated(i);
                });
            },
        };
    rn.default = Ef;
});
var Ja = _((sn) => {
    'use strict';
    Object.defineProperty(sn, '__esModule', { value: !0 });
    var br = O(),
        Ba = C(),
        bf = {
            message: ({ params: t }) => (0, br.str)`must match "${t.ifClause}" schema`,
            params: ({ params: t }) => (0, br._)`{failingKeyword: ${t.ifClause}}`,
        },
        Sf = {
            keyword: 'if',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            error: bf,
            code(t) {
                let { gen: e, parentSchema: r, it: s } = t;
                r.then === void 0 &&
                    r.else === void 0 &&
                    (0, Ba.checkStrictMode)(s, '"if" without "then" and "else" is ignored');
                let n = Ha(s, 'then'),
                    o = Ha(s, 'else');
                if (!n && !o) return;
                let a = e.let('valid', !0),
                    i = e.name('_valid');
                if ((l(), t.reset(), n && o)) {
                    let c = e.let('ifClause');
                    t.setParams({ ifClause: c }), e.if(i, u('then', c), u('else', c));
                } else n ? e.if(i, u('then')) : e.if((0, br.not)(i), u('else'));
                t.pass(a, () => t.error(!0));
                function l() {
                    let c = t.subschema({ keyword: 'if', compositeRule: !0, createErrors: !1, allErrors: !1 }, i);
                    t.mergeEvaluated(c);
                }
                function u(c, d) {
                    return () => {
                        let h = t.subschema({ keyword: c }, i);
                        e.assign(a, i),
                            t.mergeValidEvaluated(h, a),
                            d ? e.assign(d, (0, br._)`${c}`) : t.setParams({ ifClause: c });
                    };
                }
            },
        };
    function Ha(t, e) {
        let r = t.schema[e];
        return r !== void 0 && !(0, Ba.alwaysValidSchema)(t, r);
    }
    sn.default = Sf;
});
var Wa = _((nn) => {
    'use strict';
    Object.defineProperty(nn, '__esModule', { value: !0 });
    var Pf = C(),
        Nf = {
            keyword: ['then', 'else'],
            schemaType: ['object', 'boolean'],
            code({ keyword: t, parentSchema: e, it: r }) {
                e.if === void 0 && (0, Pf.checkStrictMode)(r, `"${t}" without "if" is ignored`);
            },
        };
    nn.default = Nf;
});
var Ya = _((on) => {
    'use strict';
    Object.defineProperty(on, '__esModule', { value: !0 });
    var Of = xs(),
        Rf = Na(),
        Tf = Ls(),
        If = Ra(),
        kf = Ta(),
        Cf = Ca(),
        qf = ja(),
        jf = Ws(),
        Af = Da(),
        Mf = xa(),
        Df = La(),
        Uf = za(),
        Vf = Fa(),
        Kf = Ga(),
        xf = Ja(),
        Lf = Wa();
    function zf(t = !1) {
        let e = [
            Df.default,
            Uf.default,
            Vf.default,
            Kf.default,
            xf.default,
            Lf.default,
            qf.default,
            jf.default,
            Cf.default,
            Af.default,
            Mf.default,
        ];
        return t ? e.push(Rf.default, If.default) : e.push(Of.default, Tf.default), e.push(kf.default), e;
    }
    on.default = zf;
});
var Qa = _((an) => {
    'use strict';
    Object.defineProperty(an, '__esModule', { value: !0 });
    var U = O(),
        Ff = {
            message: ({ schemaCode: t }) => (0, U.str)`must match format "${t}"`,
            params: ({ schemaCode: t }) => (0, U._)`{format: ${t}}`,
        },
        Gf = {
            keyword: 'format',
            type: ['number', 'string'],
            schemaType: 'string',
            $data: !0,
            error: Ff,
            code(t, e) {
                let { gen: r, data: s, $data: n, schema: o, schemaCode: a, it: i } = t,
                    { opts: l, errSchemaPath: u, schemaEnv: c, self: d } = i;
                if (!l.validateFormats) return;
                n ? h() : m();
                function h() {
                    let f = r.scopeValue('formats', { ref: d.formats, code: l.code.formats }),
                        p = r.const('fDef', (0, U._)`${f}[${a}]`),
                        y = r.let('fType'),
                        g = r.let('format');
                    r.if(
                        (0, U._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`,
                        () => r.assign(y, (0, U._)`${p}.type || "string"`).assign(g, (0, U._)`${p}.validate`),
                        () => r.assign(y, (0, U._)`"string"`).assign(g, p),
                    ),
                        t.fail$data((0, U.or)($(), w()));
                    function $() {
                        return l.strictSchema === !1 ? U.nil : (0, U._)`${a} && !${g}`;
                    }
                    function w() {
                        let b = c.$async
                                ? (0, U._)`(${p}.async ? await ${g}(${s}) : ${g}(${s}))`
                                : (0, U._)`${g}(${s})`,
                            v = (0, U._)`(typeof ${g} == "function" ? ${b} : ${g}.test(${s}))`;
                        return (0, U._)`${g} && ${g} !== true && ${y} === ${e} && !${v}`;
                    }
                }
                function m() {
                    let f = d.formats[o];
                    if (!f) {
                        $();
                        return;
                    }
                    if (f === !0) return;
                    let [p, y, g] = w(f);
                    p === e && t.pass(b());
                    function $() {
                        if (l.strictSchema === !1) {
                            d.logger.warn(v());
                            return;
                        }
                        throw new Error(v());
                        function v() {
                            return `unknown format "${o}" ignored in schema at path "${u}"`;
                        }
                    }
                    function w(v) {
                        let q =
                                v instanceof RegExp
                                    ? (0, U.regexpCode)(v)
                                    : l.code.formats
                                      ? (0, U._)`${l.code.formats}${(0, U.getProperty)(o)}`
                                      : void 0,
                            V = r.scopeValue('formats', { key: o, ref: v, code: q });
                        return typeof v == 'object' && !(v instanceof RegExp)
                            ? [v.type || 'string', v.validate, (0, U._)`${V}.validate`]
                            : ['string', v, V];
                    }
                    function b() {
                        if (typeof f == 'object' && !(f instanceof RegExp) && f.async) {
                            if (!c.$async) throw new Error('async format in sync schema');
                            return (0, U._)`await ${g}(${s})`;
                        }
                        return typeof y == 'function' ? (0, U._)`${g}(${s})` : (0, U._)`${g}.test(${s})`;
                    }
                }
            },
        };
    an.default = Gf;
});
var Xa = _((cn) => {
    'use strict';
    Object.defineProperty(cn, '__esModule', { value: !0 });
    var Hf = Qa(),
        Bf = [Hf.default];
    cn.default = Bf;
});
var Za = _((ot) => {
    'use strict';
    Object.defineProperty(ot, '__esModule', { value: !0 });
    ot.contentVocabulary = ot.metadataVocabulary = void 0;
    ot.metadataVocabulary = ['title', 'description', 'default', 'deprecated', 'readOnly', 'writeOnly', 'examples'];
    ot.contentVocabulary = ['contentMediaType', 'contentEncoding', 'contentSchema'];
});
var ti = _((un) => {
    'use strict';
    Object.defineProperty(un, '__esModule', { value: !0 });
    var Jf = ca(),
        Wf = Ea(),
        Yf = Ya(),
        Qf = Xa(),
        ei = Za(),
        Xf = [Jf.default, Wf.default, (0, Yf.default)(), Qf.default, ei.metadataVocabulary, ei.contentVocabulary];
    un.default = Xf;
});
var si = _((Sr) => {
    'use strict';
    Object.defineProperty(Sr, '__esModule', { value: !0 });
    Sr.DiscrError = void 0;
    var ri;
    (function (t) {
        (t.Tag = 'tag'), (t.Mapping = 'mapping');
    })(ri || (Sr.DiscrError = ri = {}));
});
var oi = _((dn) => {
    'use strict';
    Object.defineProperty(dn, '__esModule', { value: !0 });
    var at = O(),
        ln = si(),
        ni = ar(),
        Zf = Ot(),
        ep = C(),
        tp = {
            message: ({ params: { discrError: t, tagName: e } }) =>
                t === ln.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
            params: ({ params: { discrError: t, tag: e, tagName: r } }) =>
                (0, at._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`,
        },
        rp = {
            keyword: 'discriminator',
            type: 'object',
            schemaType: 'object',
            error: tp,
            code(t) {
                let { gen: e, data: r, schema: s, parentSchema: n, it: o } = t,
                    { oneOf: a } = n;
                if (!o.opts.discriminator) throw new Error('discriminator: requires discriminator option');
                let i = s.propertyName;
                if (typeof i != 'string') throw new Error('discriminator: requires propertyName');
                if (s.mapping) throw new Error('discriminator: mapping is not supported');
                if (!a) throw new Error('discriminator: requires oneOf keyword');
                let l = e.let('valid', !1),
                    u = e.const('tag', (0, at._)`${r}${(0, at.getProperty)(i)}`);
                e.if(
                    (0, at._)`typeof ${u} == "string"`,
                    () => c(),
                    () => t.error(!1, { discrError: ln.DiscrError.Tag, tag: u, tagName: i }),
                ),
                    t.ok(l);
                function c() {
                    let m = h();
                    e.if(!1);
                    for (let f in m) e.elseIf((0, at._)`${u} === ${f}`), e.assign(l, d(m[f]));
                    e.else(), t.error(!1, { discrError: ln.DiscrError.Mapping, tag: u, tagName: i }), e.endIf();
                }
                function d(m) {
                    let f = e.name('valid'),
                        p = t.subschema({ keyword: 'oneOf', schemaProp: m }, f);
                    return t.mergeEvaluated(p, at.Name), f;
                }
                function h() {
                    var m;
                    let f = {},
                        p = g(n),
                        y = !0;
                    for (let b = 0; b < a.length; b++) {
                        let v = a[b];
                        if (v?.$ref && !(0, ep.schemaHasRulesButRef)(v, o.self.RULES)) {
                            let V = v.$ref;
                            if (
                                ((v = ni.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, V)),
                                v instanceof ni.SchemaEnv && (v = v.schema),
                                v === void 0)
                            )
                                throw new Zf.default(o.opts.uriResolver, o.baseId, V);
                        }
                        let q = (m = v?.properties) === null || m === void 0 ? void 0 : m[i];
                        if (typeof q != 'object')
                            throw new Error(
                                `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`,
                            );
                        (y = y && (p || g(v))), $(q, b);
                    }
                    if (!y) throw new Error(`discriminator: "${i}" must be required`);
                    return f;
                    function g({ required: b }) {
                        return Array.isArray(b) && b.includes(i);
                    }
                    function $(b, v) {
                        if (b.const) w(b.const, v);
                        else if (b.enum) for (let q of b.enum) w(q, v);
                        else throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
                    }
                    function w(b, v) {
                        if (typeof b != 'string' || b in f)
                            throw new Error(`discriminator: "${i}" values must be unique strings`);
                        f[b] = v;
                    }
                }
            },
        };
    dn.default = rp;
});
var ai = _((qm, sp) => {
    sp.exports = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://json-schema.org/draft-07/schema#',
        title: 'Core schema meta-schema',
        definitions: {
            schemaArray: { type: 'array', minItems: 1, items: { $ref: '#' } },
            nonNegativeInteger: { type: 'integer', minimum: 0 },
            nonNegativeIntegerDefault0: { allOf: [{ $ref: '#/definitions/nonNegativeInteger' }, { default: 0 }] },
            simpleTypes: { enum: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'] },
            stringArray: { type: 'array', items: { type: 'string' }, uniqueItems: !0, default: [] },
        },
        type: ['object', 'boolean'],
        properties: {
            $id: { type: 'string', format: 'uri-reference' },
            $schema: { type: 'string', format: 'uri' },
            $ref: { type: 'string', format: 'uri-reference' },
            $comment: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            default: !0,
            readOnly: { type: 'boolean', default: !1 },
            examples: { type: 'array', items: !0 },
            multipleOf: { type: 'number', exclusiveMinimum: 0 },
            maximum: { type: 'number' },
            exclusiveMaximum: { type: 'number' },
            minimum: { type: 'number' },
            exclusiveMinimum: { type: 'number' },
            maxLength: { $ref: '#/definitions/nonNegativeInteger' },
            minLength: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
            pattern: { type: 'string', format: 'regex' },
            additionalItems: { $ref: '#' },
            items: { anyOf: [{ $ref: '#' }, { $ref: '#/definitions/schemaArray' }], default: !0 },
            maxItems: { $ref: '#/definitions/nonNegativeInteger' },
            minItems: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
            uniqueItems: { type: 'boolean', default: !1 },
            contains: { $ref: '#' },
            maxProperties: { $ref: '#/definitions/nonNegativeInteger' },
            minProperties: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
            required: { $ref: '#/definitions/stringArray' },
            additionalProperties: { $ref: '#' },
            definitions: { type: 'object', additionalProperties: { $ref: '#' }, default: {} },
            properties: { type: 'object', additionalProperties: { $ref: '#' }, default: {} },
            patternProperties: {
                type: 'object',
                additionalProperties: { $ref: '#' },
                propertyNames: { format: 'regex' },
                default: {},
            },
            dependencies: {
                type: 'object',
                additionalProperties: { anyOf: [{ $ref: '#' }, { $ref: '#/definitions/stringArray' }] },
            },
            propertyNames: { $ref: '#' },
            const: !0,
            enum: { type: 'array', items: !0, minItems: 1, uniqueItems: !0 },
            type: {
                anyOf: [
                    { $ref: '#/definitions/simpleTypes' },
                    { type: 'array', items: { $ref: '#/definitions/simpleTypes' }, minItems: 1, uniqueItems: !0 },
                ],
            },
            format: { type: 'string' },
            contentMediaType: { type: 'string' },
            contentEncoding: { type: 'string' },
            if: { $ref: '#' },
            then: { $ref: '#' },
            else: { $ref: '#' },
            allOf: { $ref: '#/definitions/schemaArray' },
            anyOf: { $ref: '#/definitions/schemaArray' },
            oneOf: { $ref: '#/definitions/schemaArray' },
            not: { $ref: '#' },
        },
        default: !0,
    };
});
var ci = _((D, fn) => {
    'use strict';
    Object.defineProperty(D, '__esModule', { value: !0 });
    D.MissingRefError =
        D.ValidationError =
        D.CodeGen =
        D.Name =
        D.nil =
        D.stringify =
        D.str =
        D._ =
        D.KeywordCxt =
        D.Ajv =
            void 0;
    var np = ra(),
        op = ti(),
        ap = oi(),
        ii = ai(),
        ip = ['/properties'],
        Pr = 'http://json-schema.org/draft-07/schema',
        it = class extends np.default {
            _addVocabularies() {
                super._addVocabularies(),
                    op.default.forEach((e) => this.addVocabulary(e)),
                    this.opts.discriminator && this.addKeyword(ap.default);
            }
            _addDefaultMetaSchema() {
                if ((super._addDefaultMetaSchema(), !this.opts.meta)) return;
                let e = this.opts.$data ? this.$dataMetaSchema(ii, ip) : ii;
                this.addMetaSchema(e, Pr, !1), (this.refs['http://json-schema.org/schema'] = Pr);
            }
            defaultMeta() {
                return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(Pr) ? Pr : void 0));
            }
        };
    D.Ajv = it;
    fn.exports = D = it;
    fn.exports.Ajv = it;
    Object.defineProperty(D, '__esModule', { value: !0 });
    D.default = it;
    var cp = Nt();
    Object.defineProperty(D, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return cp.KeywordCxt;
        },
    });
    var ct = O();
    Object.defineProperty(D, '_', {
        enumerable: !0,
        get: function () {
            return ct._;
        },
    });
    Object.defineProperty(D, 'str', {
        enumerable: !0,
        get: function () {
            return ct.str;
        },
    });
    Object.defineProperty(D, 'stringify', {
        enumerable: !0,
        get: function () {
            return ct.stringify;
        },
    });
    Object.defineProperty(D, 'nil', {
        enumerable: !0,
        get: function () {
            return ct.nil;
        },
    });
    Object.defineProperty(D, 'Name', {
        enumerable: !0,
        get: function () {
            return ct.Name;
        },
    });
    Object.defineProperty(D, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return ct.CodeGen;
        },
    });
    var up = nr();
    Object.defineProperty(D, 'ValidationError', {
        enumerable: !0,
        get: function () {
            return up.default;
        },
    });
    var lp = Ot();
    Object.defineProperty(D, 'MissingRefError', {
        enumerable: !0,
        get: function () {
            return lp.default;
        },
    });
});
var pp = {};
$i(pp, { handleHttp: () => dp, handleInvoke: () => fp, schema: () => di });
module.exports = wi(pp);
var mn = (t, e) => {
        let r = e.get(t);
        return r || ((r = new Map()), e.set(t, r)), r;
    },
    Ei = (t, e, r) => (r.set(t, e), r),
    bi = (t, e, r, s) => {
        let n = mn(t, s);
        return Ei(e, r, n), s;
    },
    Lt = (t, e, r, s, n) => {
        let o = mn(t, n);
        return bi(e, r, s, o), n;
    };
var de = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': 'true',
};
var Si = (t) => Buffer.from(t, 'base64').toString('utf-8'),
    yn = (t) => {
        let e = t.split('.');
        return JSON.parse(Si(e[1]));
    },
    gn = (t, e) => {
        try {
            return JSON.parse(e);
        } catch {
            return t;
        }
    },
    _n = (t, e) => {
        let r = t.indexOf(e);
        return r === -1 ? t : t.substring(0, r);
    };
var He = (t) => ({ statusCode: 403, headers: de, body: typeof t == 'string' ? t : JSON.stringify(t) });
var fe = (t) => ({ statusCode: 400, headers: de, body: typeof t == 'string' ? t : JSON.stringify(t) }),
    $n = (t) => ({ statusCode: 401, headers: de, body: t ? JSON.stringify(t) : 'Unauthorized' }),
    vn = (t) => ({ statusCode: 404, headers: de, body: t ? JSON.stringify(t) : 'Not Found' }),
    wn = (t) => ({ statusCode: 422, headers: de, body: t ? JSON.stringify(t) : 'Unprocessable Entity' }),
    Nr = (t) => (t.statusCode ? t : (console.error(t), { statusCode: 500, headers: de, body: t.message }));
var wp = fe({
        name: 'InvalidEmailError',
        message: 'The email must be valid and must not contain upper case letters or spaces.',
    }),
    Ep = fe({
        name: 'InvalidPasswordError',
        message: 'The password must contain at least 8 characters and at least 1 number.',
    }),
    bp = fe({
        name: 'InvalidSrpAError',
        message: 'The SRP A value must be a correctly calculated random hex hash based on big integers.',
    }),
    Sp = fe({ name: 'InvalidRefreshTokenError', message: 'Refresh token is invalid.' }),
    Pp = fe({ name: 'VerificationCodeMismatchError', message: 'The verification code does not match.' }),
    Np = He({
        name: 'VerificationCodeExpiredError',
        message:
            'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
    }),
    Op = vn({ name: 'UserNotFoundError', message: 'No user was found under the given email or user ID.' }),
    Rp = He({ name: 'UserNotVerifiedError', message: 'The user must be verified with Register Verify operation.' }),
    Tp = He({ name: 'UserExistsError', message: 'There is an existing user with the given email address.' }),
    Ip = fe({
        name: 'UserMissingPasswordChallengeError',
        message: 'The user must have an active require password change challenge.',
    }),
    kp = He({ name: 'PasswordResetRequiredError', message: 'The password must be reset.' }),
    Cp = wn({
        name: 'PasswordResetMissingParamError',
        message: 'Either a verification code or the users old password are required.',
    }),
    qp = He({
        name: 'LoginVerifyError',
        message:
            'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
    });
var zt = process.env.AWS_REGION || '',
    En = process.env.ADMIN_EMAILS || '',
    Pi = process.env.CLOUDFRONT_ACCESS_KEY_ID || '',
    Or = process.env.CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER || '',
    Ap = process.env.INVITE_USER_VALIDATION_VIEW || '',
    Mp = process.env.PULL_LAMBDA_NAME || '',
    Ni = process.env.MEDIA_DOMAIN || '',
    Dp = process.env.CLIENT_ID || '',
    Up = process.env.USER_POOL_ID || '';
var Oi = require('crypto');
var bn = (t = 100) => {
    let e = [],
        r = 0,
        s = 0,
        n = 0,
        o = (c) => {
            (e[s] = c), (s += 1);
        },
        a = () => {
            let c = e[r];
            return delete e[r], (r += 1), c;
        },
        i = () => s - r,
        l = (c) => {
            let d = new Promise((h, m) => {
                o(async () => {
                    await c().then(h).catch(m);
                });
            });
            return u(), d;
        },
        u = async () => {
            if (n < t && i() > 0) {
                let c = a();
                (n += 1), c && (await c()), (n -= 1), u();
            }
        };
    return { queueLoad: l, length: i };
};
var ki = require('@aws-sdk/s3-request-presigner'),
    z = require('@aws-sdk/client-s3');
var Ft = require('@aws-sdk/client-ssm');
var Ri = new Ft.SSMClient({ region: zt, apiVersion: 'latest' }),
    Sn = async (t, e = !1) => {
        let r = new Ft.GetParameterCommand({ Name: t, WithDecryption: e });
        try {
            let s = await Ri.send(r);
            return s.Parameter ? s.Parameter.Value : void 0;
        } catch (s) {
            console.error(s);
            return;
        }
    };
var Ti = require('@aws-sdk/cloudfront-signer'),
    Ii = () => {
        let t = null;
        return async () => (t || (t = Sn(Or || 'CLOUDFRONT_ACCESS_KEY', !0).catch(console.error)), t);
    },
    oh = Ii(),
    ah = 1 * 24 * 60 * 60 * 1e3;
var Be = new z.S3Client({ region: zt, apiVersion: 'latest' }),
    Ci = (t) =>
        new Promise((e, r) => {
            let s = [];
            t.on('data', (n) => s.push(n)), t.on('error', r), t.on('end', () => e(Buffer.concat(s)));
        }),
    pe = async (t, e, r) => {
        let s = r ? Buffer.from(JSON.stringify(r)) : void 0,
            n = new z.PutObjectCommand({ Bucket: t, Key: e, Body: s });
        try {
            await Be.send(n);
            return;
        } catch (o) {
            console.error(o);
            return;
        }
    };
var Pn = async (t, e, { uploadId: r, partEtags: s }) => {
        let n = new z.CompleteMultipartUploadCommand({
            Bucket: t,
            Key: e,
            MultipartUpload: { Parts: s.map((o, a) => ({ ETag: o, PartNumber: a + 1 })) },
            UploadId: r,
        });
        try {
            return await Be.send(n), !0;
        } catch (o) {
            throw (console.error(o), o);
        }
    },
    je = async (t, e) => {
        let r = new z.GetObjectCommand({ Bucket: t, Key: e });
        try {
            let s = await Be.send(r);
            return s.Body ? Ci(s.Body) : null;
        } catch {
            return;
        }
    },
    Ne = async (t, e) => {
        let r = new z.DeleteObjectCommand({ Bucket: t, Key: e });
        try {
            await Be.send(r);
            return;
        } catch {
            return;
        }
    };
var Rr = async (t, e) => {
    let r = new z.HeadObjectCommand({ Bucket: t, Key: e });
    try {
        let s = await Be.send(r);
        return {
            etag: s.ETag || '',
            contentType: s.ContentType || '',
            modifiedDate: s.LastModified?.toISOString() || '',
            metadata: s.Metadata,
            size: s.ContentLength || 0,
        };
    } catch {
        return !1;
    }
};
var qi = (t, e) => ({
        subscribe: (r) => {
            try {
                let s = async (n) => {
                    let o = new z.ListObjectsV2Command({ Bucket: t, Prefix: e, ContinuationToken: n }),
                        a = await Be.send(o).then(({ Contents: i, NextContinuationToken: l }) => (r.next(i || []), l));
                    a ? s(a) : r.complete();
                };
                s();
            } catch (s) {
                r.error(s);
            }
        },
    }),
    ji = async (t, e, r) =>
        new Promise((s, n) => {
            qi(t, e).subscribe({
                next: (o) =>
                    o.forEach(({ Key: a, ETag: i }) => {
                        a && i && r(a, i);
                    }),
                complete: () => s(!0),
                error: (o) => n(o),
            });
        }),
    he = async (t, e) => {
        let r = [];
        return (
            await ji(t, e, (s) => {
                r.push(s);
            }),
            r
        );
    };
var Nn = process.env.BUCKET_LOGS || '',
    Ae = process.env.BUCKET_EDGES || '',
    ut = process.env.BUCKET_REVERSE_EDGES || '',
    Je = process.env.BUCKET_NODES || '',
    Gt = process.env.BUCKET_OWNERS || '',
    lt = process.env.BUCKET_RIGHTS_ADMIN || '',
    dt = process.env.BUCKET_RIGHTS_READ || '',
    ft = process.env.BUCKET_RIGHTS_WRITE || '',
    F = process.env.BUCKET_MEDIA || '';
var { queueLoad: te } = bn(200),
    Ai = async (t) => he(Je, t),
    Mi = async (t, e) => he(Ae, `${t}/${e}/`),
    Di = async (t, e) => he(ut, `${t}/${e}/`),
    Ui = async (t, e) => {
        let r = _n(e, '*'),
            s = await he(Ae, `${t}/${r}`),
            n = new RegExp(e.replaceAll('*', '.*').replaceAll('/', '\\/'));
        return r.length < e.length - 2 ? s.filter((o) => o.match(n)) : s;
    },
    Vi = async (t) => {
        let [, , e] = t.split('/'),
            r = await je(F, t),
            { fileKey: s = '' } = r ? JSON.parse(r.toString()) : {};
        return { prop: e, fileKey: s };
    },
    Ki = async (t) => {
        let e = await he(F, `ref/${t}`),
            r = new Array(e.length);
        for (let s = 0; s < e.length; s++) r[s] = Vi(e[s]);
        return Promise.all(r);
    },
    On = () => {
        let t = 0,
            e = 0,
            r = 0,
            s = async ($) => {
                t += 1;
                let w = await te(() => je(Je, $));
                return w == null ? null : w.toString();
            },
            n = ($) => async (w, b, v) => !!(await te(() => Rr($, `${w}/${b}/${v}`))),
            o = async ($, w, b) => {
                e += 1;
                let v = await te(() => je(Ae, `${$}/${w}/${b}`));
                return v === null ? 'true' : v === void 0 ? '' : v.toString();
            },
            a = ($) => te(() => Rr(F, $)),
            i = async ($, w) => {
                let b = `ref/${$}/${w}`,
                    v = await je(F, b);
                if (!v) return null;
                let { fileKey: q = '' } = JSON.parse(v.toString());
                return { prop: w, fileKey: q };
            },
            l = async ($) => te(() => Ki($)),
            u = async ($) => {
                let w = `metadata/${$}`,
                    b = await je(F, w);
                return b ? JSON.parse(b.toString()) : null;
            },
            c = async ($) => {
                let w = await je(F, `uploads/${$}`);
                if (!w) return null;
                let { fileKey: b = '' } = JSON.parse(w.toString());
                return b;
            },
            d = async ($, w) => {
                let b = await te(() => Ui($, `${w}/`));
                if (!b) return [];
                let v = new Array(b.length);
                for (let q = 0; q < b.length; q++) {
                    let [, V, Se, le] = b[q].split('/');
                    v[q] = [V, Se, le];
                }
                return v;
            },
            h = async ($, w) => {
                let b = await te(() => Mi($, w)),
                    v = new Map();
                for (let q = 0; q < b.length; q++) {
                    let [, , , V] = b[q].split('/');
                    v.set(V, !0);
                }
                return v;
            },
            m = async ($, w) => {
                let b = await te(() => Di($, w)),
                    v = new Map();
                for (let q = 0; q < b.length; q++) {
                    let [, , , V] = b[q].split('/');
                    v.set(V, !0);
                }
                return v;
            },
            f = async ($) => te(() => Ai($)),
            p = async ($) => {
                let w = te(() => he(dt, `${$}/`)),
                    b = te(() => he(ft, `${$}/`)),
                    v = te(() => he(lt, `${$}/`)),
                    q = await w,
                    V = await b,
                    Se = await v,
                    le = new Map();
                for (let K = 0; K < q.length; K++) {
                    let [, J, Pe] = q[K].split('/');
                    (J === 'user' || J === 'role') && Lt(J, Pe, 'read', 'true', le);
                }
                for (let K = 0; K < V.length; K++) {
                    let [, J, Pe] = V[K].split('/');
                    (J === 'user' || J === 'role') && Lt(J, Pe, 'write', 'true', le);
                }
                for (let K = 0; K < Se.length; K++) {
                    let [, J, Pe] = Se[K].split('/');
                    (J === 'user' || J === 'role') && Lt(J, Pe, 'admin', 'true', le);
                }
                return le;
            },
            y = async ($) => {
                let w = await te(() => he(Gt, `${$}/`));
                return w && w.length > 0;
            },
            g = () => ({ nodes: t, metadata: e, files: r });
        return {
            getNode: s,
            getRead: n(dt),
            getWrite: n(ft),
            getAdmin: n(lt),
            getMetadata: o,
            getFileHead: a,
            getFileRef: i,
            getFileRefs: l,
            getFileMetadata: u,
            getUpload: c,
            getEdges: h,
            getReverseEdges: m,
            getEdgesWildcard: d,
            getNodesWildcard: f,
            listRights: p,
            ownerExists: y,
            getLog: g,
        };
    };
var Rn = () => {
    let t = async (u, c) => (c === null ? Ne(Je, u) : pe(Je, u, c)),
        e = async (u, c, d, h) => (h ? pe(Ae, `${u}/${c}/${d}`, h) : Ne(Ae, `${u}/${c}/${d}`)),
        r = async (u, c, d, h) => (h ? pe(ut, `${u}/${c}/${d}`, !0) : Ne(ut, `${u}/${c}/${d}`)),
        s = (u) => async (c, d, h, m) => {
            let f = `${c}/${d}/${h}`;
            return m ? pe(u, f, !0) : Ne(u, f);
        },
        n = async (u, c) => {
            if (c === null) throw new Error('Cannot set owner to null');
            return pe(Gt, `${u}/owner/${c}`, !0);
        },
        o = async (u, c, d) => {
            let h = `ref/${u}/${c}`;
            return d === null ? Ne(F, h) : pe(F, h, d);
        },
        a = async (u, c) => (c === null ? Ne(F, `metadata/${u}`) : pe(F, `metadata/${u}`, c)),
        i = async (u, c) => (c === null ? Ne(F, `uploads/${u}`) : pe(F, `uploads/${u}`, { fileKey: c })),
        l = async (u, c, d) => {
            let h = new Date().toISOString(),
                m = `{"userEmail":"${u}","timestamp":"${h}","requestId":"${c}","changeset":${d}}`,
                f = `push/${u}/${h}/${c}`;
            await pe(Nn, f, m);
        };
    return {
        setNode: t,
        setMetadata: e,
        setReverseEdge: r,
        setRead: s(dt),
        setWrite: s(ft),
        setAdmin: s(lt),
        setOwner: n,
        setFileRef: o,
        setFileMetadata: a,
        setUploadId: i,
        setPushLog: l,
    };
};
var ui = vi(ci(), 1);
var li = async (t, e) => {
    let r;
    try {
        r = yn(e.headers.Authorization || e.headers.authorization || '');
    } catch {
        throw $n();
    }
    let s = null;
    try {
        let n = gn(e.body || {}, e.body || ''),
            o = new ui.Ajv();
        if ((o.addKeyword('example'), o.validate(t, n))) {
            let i = r.email,
                l = e.headers['x-as-role'] || 'user',
                u = !!e.headers['x-as-admin'] && En.includes(i);
            return { userEmail: i, body: n, asAdmin: u, asRole: l };
        } else s = fe(JSON.stringify(o.errors));
    } catch (n) {
        s = fe(n.message);
    }
    throw s;
};
var di = {
        type: 'object',
        additionalProperties: !1,
        properties: {
            uploadId: { type: 'string', description: '' },
            partEtags: { type: 'array', description: '', items: { type: 'string' } },
        },
        required: ['uploadId', 'partEtags'],
    },
    fi = async ({ body: t }) => {
        let { uploadId: e, partEtags: r } = t,
            s = On(),
            n = Rn(),
            o = await s.getUpload(e);
        return o
            ? (await Pn(F, o, { uploadId: e, partEtags: r }),
              await n.setUploadId(e, null),
              { statusCode: 200, headers: de, body: JSON.stringify({}) })
            : { statusCode: 400, headers: de, body: JSON.stringify({ message: 'Invalid Upload ID' }) };
    },
    dp = async (t) => {
        try {
            let e = await li(di, t);
            return await fi(e);
        } catch (e) {
            return Nr(e);
        }
    },
    fp = async ({ body: t }) => {
        try {
            return await fi(t);
        } catch (e) {
            return Nr(e);
        }
    };
0 && (module.exports = { handleHttp, handleInvoke, schema });
