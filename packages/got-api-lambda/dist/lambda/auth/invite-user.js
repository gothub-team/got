'use strict';
var ui = Object.create;
var Pt = Object.defineProperty;
var di = Object.getOwnPropertyDescriptor;
var li = Object.getOwnPropertyNames;
var fi = Object.getPrototypeOf,
    hi = Object.prototype.hasOwnProperty;
var g = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    pi = (t, e) => {
        for (var r in e) Pt(t, r, { get: e[r], enumerable: !0 });
    },
    on = (t, e, r, s) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
            for (let n of li(e))
                !hi.call(t, n) && n !== r && Pt(t, n, { get: () => e[n], enumerable: !(s = di(e, n)) || s.enumerable });
        return t;
    };
var pr = (t, e, r) => (
        (r = t != null ? ui(fi(t)) : {}),
        on(e || !t || !t.__esModule ? Pt(r, 'default', { value: t, enumerable: !0 }) : r, t)
    ),
    mi = (t) => on(Pt({}, '__esModule', { value: !0 }), t);
var Ze = g((k) => {
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
    var Xe = class {};
    k._CodeOrName = Xe;
    k.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Ne = class extends Xe {
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
    k.Name = Ne;
    var X = class extends Xe {
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
                      (r, s) => (s instanceof Ne && (r[s.str] = (r[s.str] || 0) + 1), r),
                      {},
                  ));
        }
    };
    k._Code = X;
    k.nil = new X('');
    function Sn(t, ...e) {
        let r = [t[0]],
            s = 0;
        for (; s < e.length; ) wr(r, e[s]), r.push(t[++s]);
        return new X(r);
    }
    k._ = Sn;
    var $r = new X('+');
    function Pn(t, ...e) {
        let r = [Ye(t[0])],
            s = 0;
        for (; s < e.length; ) r.push($r), wr(r, e[s]), r.push($r, Ye(t[++s]));
        return Ei(r), new X(r);
    }
    k.str = Pn;
    function wr(t, e) {
        e instanceof X ? t.push(...e._items) : e instanceof Ne ? t.push(e) : t.push(Pi(e));
    }
    k.addCodeArg = wr;
    function Ei(t) {
        let e = 1;
        for (; e < t.length - 1; ) {
            if (t[e] === $r) {
                let r = bi(t[e - 1], t[e + 1]);
                if (r !== void 0) {
                    t.splice(e - 1, 3, r);
                    continue;
                }
                t[e++] = '+';
            }
            e++;
        }
    }
    function bi(t, e) {
        if (e === '""') return t;
        if (t === '""') return e;
        if (typeof t == 'string')
            return e instanceof Ne || t[t.length - 1] !== '"'
                ? void 0
                : typeof e != 'string'
                  ? `${t.slice(0, -1)}${e}"`
                  : e[0] === '"'
                    ? t.slice(0, -1) + e.slice(1)
                    : void 0;
        if (typeof e == 'string' && e[0] === '"' && !(t instanceof Ne)) return `"${t}${e.slice(1)}`;
    }
    function Si(t, e) {
        return e.emptyStr() ? t : t.emptyStr() ? e : Pn`${t}${e}`;
    }
    k.strConcat = Si;
    function Pi(t) {
        return typeof t == 'number' || typeof t == 'boolean' || t === null ? t : Ye(Array.isArray(t) ? t.join(',') : t);
    }
    function Ni(t) {
        return new X(Ye(t));
    }
    k.stringify = Ni;
    function Ye(t) {
        return JSON.stringify(t)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
    }
    k.safeStringify = Ye;
    function Ii(t) {
        return typeof t == 'string' && k.IDENTIFIER.test(t) ? new X(`.${t}`) : Sn`[${t}]`;
    }
    k.getProperty = Ii;
    function Ri(t) {
        if (typeof t == 'string' && k.IDENTIFIER.test(t)) return new X(`${t}`);
        throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`);
    }
    k.getEsmExportName = Ri;
    function Oi(t) {
        return new X(t.toString());
    }
    k.regexpCode = Oi;
});
var Sr = g((W) => {
    'use strict';
    Object.defineProperty(W, '__esModule', { value: !0 });
    W.ValueScope = W.ValueScopeName = W.Scope = W.varKinds = W.UsedValueState = void 0;
    var J = Ze(),
        Er = class extends Error {
            constructor(e) {
                super(`CodeGen: "code" for ${e} not defined`), (this.value = e.value);
            }
        },
        Tt;
    (function (t) {
        (t[(t.Started = 0)] = 'Started'), (t[(t.Completed = 1)] = 'Completed');
    })(Tt || (W.UsedValueState = Tt = {}));
    W.varKinds = { const: new J.Name('const'), let: new J.Name('let'), var: new J.Name('var') };
    var qt = class {
        constructor({ prefixes: e, parent: r } = {}) {
            (this._names = {}), (this._prefixes = e), (this._parent = r);
        }
        toName(e) {
            return e instanceof J.Name ? e : this.name(e);
        }
        name(e) {
            return new J.Name(this._newName(e));
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
    W.Scope = qt;
    var At = class extends J.Name {
        constructor(e, r) {
            super(r), (this.prefix = e);
        }
        setValue(e, { property: r, itemIndex: s }) {
            (this.value = e), (this.scopePath = (0, J._)`.${new J.Name(r)}[${s}]`);
        }
    };
    W.ValueScopeName = At;
    var ki = (0, J._)`\n`,
        br = class extends qt {
            constructor(e) {
                super(e),
                    (this._values = {}),
                    (this._scope = e.scope),
                    (this.opts = { ...e, _n: e.lines ? ki : J.nil });
            }
            get() {
                return this._scope;
            }
            name(e) {
                return new At(e, this._newName(e));
            }
            value(e, r) {
                var s;
                if (r.ref === void 0) throw new Error('CodeGen: ref must be passed in value');
                let n = this.toName(e),
                    { prefix: o } = n,
                    a = (s = r.key) !== null && s !== void 0 ? s : r.ref,
                    i = this._values[o];
                if (i) {
                    let d = i.get(a);
                    if (d) return d;
                } else i = this._values[o] = new Map();
                i.set(a, n);
                let c = this._scope[o] || (this._scope[o] = []),
                    u = c.length;
                return (c[u] = r.ref), n.setValue(r, { property: o, itemIndex: u }), n;
            }
            getValue(e, r) {
                let s = this._values[e];
                if (s) return s.get(r);
            }
            scopeRefs(e, r = this._values) {
                return this._reduceValues(r, (s) => {
                    if (s.scopePath === void 0) throw new Error(`CodeGen: name "${s}" has no value`);
                    return (0, J._)`${e}${s.scopePath}`;
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
                let o = J.nil;
                for (let a in e) {
                    let i = e[a];
                    if (!i) continue;
                    let c = (s[a] = s[a] || new Map());
                    i.forEach((u) => {
                        if (c.has(u)) return;
                        c.set(u, Tt.Started);
                        let d = r(u);
                        if (d) {
                            let l = this.opts.es5 ? W.varKinds.var : W.varKinds.const;
                            o = (0, J._)`${o}${l} ${u} = ${d};${this.opts._n}`;
                        } else if ((d = n?.(u))) o = (0, J._)`${o}${d}${this.opts._n}`;
                        else throw new Er(u);
                        c.set(u, Tt.Completed);
                    });
                }
                return o;
            }
        };
    W.ValueScope = br;
});
var S = g((b) => {
    'use strict';
    Object.defineProperty(b, '__esModule', { value: !0 });
    b.or =
        b.and =
        b.not =
        b.CodeGen =
        b.operators =
        b.varKinds =
        b.ValueScopeName =
        b.ValueScope =
        b.Scope =
        b.Name =
        b.regexpCode =
        b.stringify =
        b.getProperty =
        b.nil =
        b.strConcat =
        b.str =
        b._ =
            void 0;
    var I = Ze(),
        te = Sr(),
        _e = Ze();
    Object.defineProperty(b, '_', {
        enumerable: !0,
        get: function () {
            return _e._;
        },
    });
    Object.defineProperty(b, 'str', {
        enumerable: !0,
        get: function () {
            return _e.str;
        },
    });
    Object.defineProperty(b, 'strConcat', {
        enumerable: !0,
        get: function () {
            return _e.strConcat;
        },
    });
    Object.defineProperty(b, 'nil', {
        enumerable: !0,
        get: function () {
            return _e.nil;
        },
    });
    Object.defineProperty(b, 'getProperty', {
        enumerable: !0,
        get: function () {
            return _e.getProperty;
        },
    });
    Object.defineProperty(b, 'stringify', {
        enumerable: !0,
        get: function () {
            return _e.stringify;
        },
    });
    Object.defineProperty(b, 'regexpCode', {
        enumerable: !0,
        get: function () {
            return _e.regexpCode;
        },
    });
    Object.defineProperty(b, 'Name', {
        enumerable: !0,
        get: function () {
            return _e.Name;
        },
    });
    var Dt = Sr();
    Object.defineProperty(b, 'Scope', {
        enumerable: !0,
        get: function () {
            return Dt.Scope;
        },
    });
    Object.defineProperty(b, 'ValueScope', {
        enumerable: !0,
        get: function () {
            return Dt.ValueScope;
        },
    });
    Object.defineProperty(b, 'ValueScopeName', {
        enumerable: !0,
        get: function () {
            return Dt.ValueScopeName;
        },
    });
    Object.defineProperty(b, 'varKinds', {
        enumerable: !0,
        get: function () {
            return Dt.varKinds;
        },
    });
    b.operators = {
        GT: new I._Code('>'),
        GTE: new I._Code('>='),
        LT: new I._Code('<'),
        LTE: new I._Code('<='),
        EQ: new I._Code('==='),
        NEQ: new I._Code('!=='),
        NOT: new I._Code('!'),
        OR: new I._Code('||'),
        AND: new I._Code('&&'),
        ADD: new I._Code('+'),
    };
    var he = class {
            optimizeNodes() {
                return this;
            }
            optimizeNames(e, r) {
                return this;
            }
        },
        Pr = class extends he {
            constructor(e, r, s) {
                super(), (this.varKind = e), (this.name = r), (this.rhs = s);
            }
            render({ es5: e, _n: r }) {
                let s = e ? te.varKinds.var : this.varKind,
                    n = this.rhs === void 0 ? '' : ` = ${this.rhs}`;
                return `${s} ${this.name}${n};${r}`;
            }
            optimizeNames(e, r) {
                if (e[this.name.str]) return this.rhs && (this.rhs = De(this.rhs, e, r)), this;
            }
            get names() {
                return this.rhs instanceof I._CodeOrName ? this.rhs.names : {};
            }
        },
        Ct = class extends he {
            constructor(e, r, s) {
                super(), (this.lhs = e), (this.rhs = r), (this.sideEffects = s);
            }
            render({ _n: e }) {
                return `${this.lhs} = ${this.rhs};${e}`;
            }
            optimizeNames(e, r) {
                if (!(this.lhs instanceof I.Name && !e[this.lhs.str] && !this.sideEffects))
                    return (this.rhs = De(this.rhs, e, r)), this;
            }
            get names() {
                let e = this.lhs instanceof I.Name ? {} : { ...this.lhs.names };
                return Mt(e, this.rhs);
            }
        },
        Nr = class extends Ct {
            constructor(e, r, s, n) {
                super(e, s, n), (this.op = r);
            }
            render({ _n: e }) {
                return `${this.lhs} ${this.op}= ${this.rhs};${e}`;
            }
        },
        Ir = class extends he {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `${this.label}:${e}`;
            }
        },
        Rr = class extends he {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `break${this.label ? ` ${this.label}` : ''};${e}`;
            }
        },
        Or = class extends he {
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
        kr = class extends he {
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
                return (this.code = De(this.code, e, r)), this;
            }
            get names() {
                return this.code instanceof I._CodeOrName ? this.code.names : {};
            }
        },
        et = class extends he {
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
                    o.optimizeNames(e, r) || (Ti(e, o.names), s.splice(n, 1));
                }
                return s.length > 0 ? this : void 0;
            }
            get names() {
                return this.nodes.reduce((e, r) => Oe(e, r.names), {});
            }
        },
        pe = class extends et {
            render(e) {
                return `{${e._n}${super.render(e)}}${e._n}`;
            }
        },
        Tr = class extends et {},
        Me = class extends pe {};
    Me.kind = 'else';
    var Ie = class t extends pe {
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
                r = this.else = Array.isArray(s) ? new Me(s) : s;
            }
            if (r)
                return e === !1
                    ? r instanceof t
                        ? r
                        : r.nodes
                    : this.nodes.length
                      ? this
                      : new t(Nn(e), r instanceof t ? [r] : r.nodes);
            if (!(e === !1 || !this.nodes.length)) return this;
        }
        optimizeNames(e, r) {
            var s;
            if (
                ((this.else = (s = this.else) === null || s === void 0 ? void 0 : s.optimizeNames(e, r)),
                !!(super.optimizeNames(e, r) || this.else))
            )
                return (this.condition = De(this.condition, e, r)), this;
        }
        get names() {
            let e = super.names;
            return Mt(e, this.condition), this.else && Oe(e, this.else.names), e;
        }
    };
    Ie.kind = 'if';
    var Re = class extends pe {};
    Re.kind = 'for';
    var qr = class extends Re {
            constructor(e) {
                super(), (this.iteration = e);
            }
            render(e) {
                return `for(${this.iteration})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iteration = De(this.iteration, e, r)), this;
            }
            get names() {
                return Oe(super.names, this.iteration.names);
            }
        },
        Ar = class extends Re {
            constructor(e, r, s, n) {
                super(), (this.varKind = e), (this.name = r), (this.from = s), (this.to = n);
            }
            render(e) {
                let r = e.es5 ? te.varKinds.var : this.varKind,
                    { name: s, from: n, to: o } = this;
                return `for(${r} ${s}=${n}; ${s}<${o}; ${s}++)${super.render(e)}`;
            }
            get names() {
                let e = Mt(super.names, this.from);
                return Mt(e, this.to);
            }
        },
        jt = class extends Re {
            constructor(e, r, s, n) {
                super(), (this.loop = e), (this.varKind = r), (this.name = s), (this.iterable = n);
            }
            render(e) {
                return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iterable = De(this.iterable, e, r)), this;
            }
            get names() {
                return Oe(super.names, this.iterable.names);
            }
        },
        tt = class extends pe {
            constructor(e, r, s) {
                super(), (this.name = e), (this.args = r), (this.async = s);
            }
            render(e) {
                return `${this.async ? 'async ' : ''}function ${this.name}(${this.args})${super.render(e)}`;
            }
        };
    tt.kind = 'func';
    var rt = class extends et {
        render(e) {
            return `return ${super.render(e)}`;
        }
    };
    rt.kind = 'return';
    var Cr = class extends pe {
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
                return this.catch && Oe(e, this.catch.names), this.finally && Oe(e, this.finally.names), e;
            }
        },
        st = class extends pe {
            constructor(e) {
                super(), (this.error = e);
            }
            render(e) {
                return `catch(${this.error})${super.render(e)}`;
            }
        };
    st.kind = 'catch';
    var nt = class extends pe {
        render(e) {
            return `finally${super.render(e)}`;
        }
    };
    nt.kind = 'finally';
    var jr = class {
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
                (this._scope = new te.Scope({ parent: e })),
                (this._nodes = [new Tr()]);
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
            return s !== void 0 && n && (this._constants[o.str] = s), this._leafNode(new Pr(e, o, s)), o;
        }
        const(e, r, s) {
            return this._def(te.varKinds.const, e, r, s);
        }
        let(e, r, s) {
            return this._def(te.varKinds.let, e, r, s);
        }
        var(e, r, s) {
            return this._def(te.varKinds.var, e, r, s);
        }
        assign(e, r, s) {
            return this._leafNode(new Ct(e, r, s));
        }
        add(e, r) {
            return this._leafNode(new Nr(e, b.operators.ADD, r));
        }
        code(e) {
            return typeof e == 'function' ? e() : e !== I.nil && this._leafNode(new kr(e)), this;
        }
        object(...e) {
            let r = ['{'];
            for (let [s, n] of e)
                r.length > 1 && r.push(','),
                    r.push(s),
                    (s !== n || this.opts.es5) && (r.push(':'), (0, I.addCodeArg)(r, n));
            return r.push('}'), new I._Code(r);
        }
        if(e, r, s) {
            if ((this._blockNode(new Ie(e)), r && s)) this.code(r).else().code(s).endIf();
            else if (r) this.code(r).endIf();
            else if (s) throw new Error('CodeGen: "else" body without "then" body');
            return this;
        }
        elseIf(e) {
            return this._elseNode(new Ie(e));
        }
        else() {
            return this._elseNode(new Me());
        }
        endIf() {
            return this._endBlockNode(Ie, Me);
        }
        _for(e, r) {
            return this._blockNode(e), r && this.code(r).endFor(), this;
        }
        for(e, r) {
            return this._for(new qr(e), r);
        }
        forRange(e, r, s, n, o = this.opts.es5 ? te.varKinds.var : te.varKinds.let) {
            let a = this._scope.toName(e);
            return this._for(new Ar(o, a, r, s), () => n(a));
        }
        forOf(e, r, s, n = te.varKinds.const) {
            let o = this._scope.toName(e);
            if (this.opts.es5) {
                let a = r instanceof I.Name ? r : this.var('_arr', r);
                return this.forRange('_i', 0, (0, I._)`${a}.length`, (i) => {
                    this.var(o, (0, I._)`${a}[${i}]`), s(o);
                });
            }
            return this._for(new jt('of', n, o, r), () => s(o));
        }
        forIn(e, r, s, n = this.opts.es5 ? te.varKinds.var : te.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(e, (0, I._)`Object.keys(${r})`, s);
            let o = this._scope.toName(e);
            return this._for(new jt('in', n, o, r), () => s(o));
        }
        endFor() {
            return this._endBlockNode(Re);
        }
        label(e) {
            return this._leafNode(new Ir(e));
        }
        break(e) {
            return this._leafNode(new Rr(e));
        }
        return(e) {
            let r = new rt();
            if ((this._blockNode(r), this.code(e), r.nodes.length !== 1))
                throw new Error('CodeGen: "return" should have one node');
            return this._endBlockNode(rt);
        }
        try(e, r, s) {
            if (!r && !s) throw new Error('CodeGen: "try" without "catch" and "finally"');
            let n = new Cr();
            if ((this._blockNode(n), this.code(e), r)) {
                let o = this.name('e');
                (this._currNode = n.catch = new st(o)), r(o);
            }
            return s && ((this._currNode = n.finally = new nt()), this.code(s)), this._endBlockNode(st, nt);
        }
        throw(e) {
            return this._leafNode(new Or(e));
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
        func(e, r = I.nil, s, n) {
            return this._blockNode(new tt(e, r, s)), n && this.code(n).endFunc(), this;
        }
        endFunc() {
            return this._endBlockNode(tt);
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
            if (!(r instanceof Ie)) throw new Error('CodeGen: "else" without "if"');
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
    b.CodeGen = jr;
    function Oe(t, e) {
        for (let r in e) t[r] = (t[r] || 0) + (e[r] || 0);
        return t;
    }
    function Mt(t, e) {
        return e instanceof I._CodeOrName ? Oe(t, e.names) : t;
    }
    function De(t, e, r) {
        if (t instanceof I.Name) return s(t);
        if (!n(t)) return t;
        return new I._Code(
            t._items.reduce(
                (o, a) => (
                    a instanceof I.Name && (a = s(a)), a instanceof I._Code ? o.push(...a._items) : o.push(a), o
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
                o instanceof I._Code &&
                o._items.some((a) => a instanceof I.Name && e[a.str] === 1 && r[a.str] !== void 0)
            );
        }
    }
    function Ti(t, e) {
        for (let r in e) t[r] = (t[r] || 0) - (e[r] || 0);
    }
    function Nn(t) {
        return typeof t == 'boolean' || typeof t == 'number' || t === null ? !t : (0, I._)`!${Mr(t)}`;
    }
    b.not = Nn;
    var qi = In(b.operators.AND);
    function Ai(...t) {
        return t.reduce(qi);
    }
    b.and = Ai;
    var Ci = In(b.operators.OR);
    function ji(...t) {
        return t.reduce(Ci);
    }
    b.or = ji;
    function In(t) {
        return (e, r) => (e === I.nil ? r : r === I.nil ? e : (0, I._)`${Mr(e)} ${t} ${Mr(r)}`);
    }
    function Mr(t) {
        return t instanceof I.Name ? t : (0, I._)`(${t})`;
    }
});
var T = g((P) => {
    'use strict';
    Object.defineProperty(P, '__esModule', { value: !0 });
    P.checkStrictMode =
        P.getErrorPath =
        P.Type =
        P.useFunc =
        P.setEvaluated =
        P.evaluatedPropsToName =
        P.mergeEvaluated =
        P.eachItem =
        P.unescapeJsonPointer =
        P.escapeJsonPointer =
        P.escapeFragment =
        P.unescapeFragment =
        P.schemaRefOrVal =
        P.schemaHasRulesButRef =
        P.schemaHasRules =
        P.checkUnknownRules =
        P.alwaysValidSchema =
        P.toHash =
            void 0;
    var A = S(),
        Mi = Ze();
    function Di(t) {
        let e = {};
        for (let r of t) e[r] = !0;
        return e;
    }
    P.toHash = Di;
    function Ui(t, e) {
        return typeof e == 'boolean' ? e : Object.keys(e).length === 0 ? !0 : (kn(t, e), !Tn(e, t.self.RULES.all));
    }
    P.alwaysValidSchema = Ui;
    function kn(t, e = t.schema) {
        let { opts: r, self: s } = t;
        if (!r.strictSchema || typeof e == 'boolean') return;
        let n = s.RULES.keywords;
        for (let o in e) n[o] || Cn(t, `unknown keyword: "${o}"`);
    }
    P.checkUnknownRules = kn;
    function Tn(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e[r]) return !0;
        return !1;
    }
    P.schemaHasRules = Tn;
    function Vi(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (r !== '$ref' && e.all[r]) return !0;
        return !1;
    }
    P.schemaHasRulesButRef = Vi;
    function xi({ topSchemaRef: t, schemaPath: e }, r, s, n) {
        if (!n) {
            if (typeof r == 'number' || typeof r == 'boolean') return r;
            if (typeof r == 'string') return (0, A._)`${r}`;
        }
        return (0, A._)`${t}${e}${(0, A.getProperty)(s)}`;
    }
    P.schemaRefOrVal = xi;
    function Li(t) {
        return qn(decodeURIComponent(t));
    }
    P.unescapeFragment = Li;
    function zi(t) {
        return encodeURIComponent(Ur(t));
    }
    P.escapeFragment = zi;
    function Ur(t) {
        return typeof t == 'number' ? `${t}` : t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
    P.escapeJsonPointer = Ur;
    function qn(t) {
        return t.replace(/~1/g, '/').replace(/~0/g, '~');
    }
    P.unescapeJsonPointer = qn;
    function Fi(t, e) {
        if (Array.isArray(t)) for (let r of t) e(r);
        else e(t);
    }
    P.eachItem = Fi;
    function Rn({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: s }) {
        return (n, o, a, i) => {
            let c =
                a === void 0
                    ? o
                    : a instanceof A.Name
                      ? (o instanceof A.Name ? t(n, o, a) : e(n, o, a), a)
                      : o instanceof A.Name
                        ? (e(n, a, o), o)
                        : r(o, a);
            return i === A.Name && !(c instanceof A.Name) ? s(n, c) : c;
        };
    }
    P.mergeEvaluated = {
        props: Rn({
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
                    e === !0 ? t.assign(r, !0) : (t.assign(r, (0, A._)`${r} || {}`), Vr(t, r, e));
                }),
            mergeValues: (t, e) => (t === !0 ? !0 : { ...t, ...e }),
            resultToName: An,
        }),
        items: Rn({
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
    function An(t, e) {
        if (e === !0) return t.var('props', !0);
        let r = t.var('props', (0, A._)`{}`);
        return e !== void 0 && Vr(t, r, e), r;
    }
    P.evaluatedPropsToName = An;
    function Vr(t, e, r) {
        Object.keys(r).forEach((s) => t.assign((0, A._)`${e}${(0, A.getProperty)(s)}`, !0));
    }
    P.setEvaluated = Vr;
    var On = {};
    function Ki(t, e) {
        return t.scopeValue('func', { ref: e, code: On[e.code] || (On[e.code] = new Mi._Code(e.code)) });
    }
    P.useFunc = Ki;
    var Dr;
    (function (t) {
        (t[(t.Num = 0)] = 'Num'), (t[(t.Str = 1)] = 'Str');
    })(Dr || (P.Type = Dr = {}));
    function Hi(t, e, r) {
        if (t instanceof A.Name) {
            let s = e === Dr.Num;
            return r
                ? s
                    ? (0, A._)`"[" + ${t} + "]"`
                    : (0, A._)`"['" + ${t} + "']"`
                : s
                  ? (0, A._)`"/" + ${t}`
                  : (0, A._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
        }
        return r ? (0, A.getProperty)(t).toString() : `/${Ur(t)}`;
    }
    P.getErrorPath = Hi;
    function Cn(t, e, r = t.opts.strictSchema) {
        if (r) {
            if (((e = `strict mode: ${e}`), r === !0)) throw new Error(e);
            t.self.logger.warn(e);
        }
    }
    P.checkStrictMode = Cn;
});
var me = g((xr) => {
    'use strict';
    Object.defineProperty(xr, '__esModule', { value: !0 });
    var z = S(),
        Gi = {
            data: new z.Name('data'),
            valCxt: new z.Name('valCxt'),
            instancePath: new z.Name('instancePath'),
            parentData: new z.Name('parentData'),
            parentDataProperty: new z.Name('parentDataProperty'),
            rootData: new z.Name('rootData'),
            dynamicAnchors: new z.Name('dynamicAnchors'),
            vErrors: new z.Name('vErrors'),
            errors: new z.Name('errors'),
            this: new z.Name('this'),
            self: new z.Name('self'),
            scope: new z.Name('scope'),
            json: new z.Name('json'),
            jsonPos: new z.Name('jsonPos'),
            jsonLen: new z.Name('jsonLen'),
            jsonPart: new z.Name('jsonPart'),
        };
    xr.default = Gi;
});
var ot = g((F) => {
    'use strict';
    Object.defineProperty(F, '__esModule', { value: !0 });
    F.extendErrors =
        F.resetErrorsCount =
        F.reportExtraError =
        F.reportError =
        F.keyword$DataError =
        F.keywordError =
            void 0;
    var O = S(),
        Ut = T(),
        H = me();
    F.keywordError = { message: ({ keyword: t }) => (0, O.str)`must pass "${t}" keyword validation` };
    F.keyword$DataError = {
        message: ({ keyword: t, schemaType: e }) =>
            e ? (0, O.str)`"${t}" keyword must be ${e} ($data)` : (0, O.str)`"${t}" keyword is invalid ($data)`,
    };
    function Ji(t, e = F.keywordError, r, s) {
        let { it: n } = t,
            { gen: o, compositeRule: a, allErrors: i } = n,
            c = Dn(t, e, r);
        (s ?? (a || i)) ? jn(o, c) : Mn(n, (0, O._)`[${c}]`);
    }
    F.reportError = Ji;
    function Wi(t, e = F.keywordError, r) {
        let { it: s } = t,
            { gen: n, compositeRule: o, allErrors: a } = s,
            i = Dn(t, e, r);
        jn(n, i), o || a || Mn(s, H.default.vErrors);
    }
    F.reportExtraError = Wi;
    function Bi(t, e) {
        t.assign(H.default.errors, e),
            t.if((0, O._)`${H.default.vErrors} !== null`, () =>
                t.if(
                    e,
                    () => t.assign((0, O._)`${H.default.vErrors}.length`, e),
                    () => t.assign(H.default.vErrors, null),
                ),
            );
    }
    F.resetErrorsCount = Bi;
    function Qi({ gen: t, keyword: e, schemaValue: r, data: s, errsCount: n, it: o }) {
        if (n === void 0) throw new Error('ajv implementation error');
        let a = t.name('err');
        t.forRange('i', n, H.default.errors, (i) => {
            t.const(a, (0, O._)`${H.default.vErrors}[${i}]`),
                t.if((0, O._)`${a}.instancePath === undefined`, () =>
                    t.assign((0, O._)`${a}.instancePath`, (0, O.strConcat)(H.default.instancePath, o.errorPath)),
                ),
                t.assign((0, O._)`${a}.schemaPath`, (0, O.str)`${o.errSchemaPath}/${e}`),
                o.opts.verbose && (t.assign((0, O._)`${a}.schema`, r), t.assign((0, O._)`${a}.data`, s));
        });
    }
    F.extendErrors = Qi;
    function jn(t, e) {
        let r = t.const('err', e);
        t.if(
            (0, O._)`${H.default.vErrors} === null`,
            () => t.assign(H.default.vErrors, (0, O._)`[${r}]`),
            (0, O._)`${H.default.vErrors}.push(${r})`,
        ),
            t.code((0, O._)`${H.default.errors}++`);
    }
    function Mn(t, e) {
        let { gen: r, validateName: s, schemaEnv: n } = t;
        n.$async
            ? r.throw((0, O._)`new ${t.ValidationError}(${e})`)
            : (r.assign((0, O._)`${s}.errors`, e), r.return(!1));
    }
    var ke = {
        keyword: new O.Name('keyword'),
        schemaPath: new O.Name('schemaPath'),
        params: new O.Name('params'),
        propertyName: new O.Name('propertyName'),
        message: new O.Name('message'),
        schema: new O.Name('schema'),
        parentSchema: new O.Name('parentSchema'),
    };
    function Dn(t, e, r) {
        let { createErrors: s } = t.it;
        return s === !1 ? (0, O._)`{}` : Xi(t, e, r);
    }
    function Xi(t, e, r = {}) {
        let { gen: s, it: n } = t,
            o = [Yi(n, r), Zi(t, r)];
        return ec(t, e, o), s.object(...o);
    }
    function Yi({ errorPath: t }, { instancePath: e }) {
        let r = e ? (0, O.str)`${t}${(0, Ut.getErrorPath)(e, Ut.Type.Str)}` : t;
        return [H.default.instancePath, (0, O.strConcat)(H.default.instancePath, r)];
    }
    function Zi({ keyword: t, it: { errSchemaPath: e } }, { schemaPath: r, parentSchema: s }) {
        let n = s ? e : (0, O.str)`${e}/${t}`;
        return r && (n = (0, O.str)`${n}${(0, Ut.getErrorPath)(r, Ut.Type.Str)}`), [ke.schemaPath, n];
    }
    function ec(t, { params: e, message: r }, s) {
        let { keyword: n, data: o, schemaValue: a, it: i } = t,
            { opts: c, propertyName: u, topSchemaRef: d, schemaPath: l } = i;
        s.push([ke.keyword, n], [ke.params, typeof e == 'function' ? e(t) : e || (0, O._)`{}`]),
            c.messages && s.push([ke.message, typeof r == 'function' ? r(t) : r]),
            c.verbose && s.push([ke.schema, a], [ke.parentSchema, (0, O._)`${d}${l}`], [H.default.data, o]),
            u && s.push([ke.propertyName, u]);
    }
});
var Vn = g((Ue) => {
    'use strict';
    Object.defineProperty(Ue, '__esModule', { value: !0 });
    Ue.boolOrEmptySchema = Ue.topBoolOrEmptySchema = void 0;
    var tc = ot(),
        rc = S(),
        sc = me(),
        nc = { message: 'boolean schema is false' };
    function oc(t) {
        let { gen: e, schema: r, validateName: s } = t;
        r === !1
            ? Un(t, !1)
            : typeof r == 'object' && r.$async === !0
              ? e.return(sc.default.data)
              : (e.assign((0, rc._)`${s}.errors`, null), e.return(!0));
    }
    Ue.topBoolOrEmptySchema = oc;
    function ac(t, e) {
        let { gen: r, schema: s } = t;
        s === !1 ? (r.var(e, !1), Un(t)) : r.var(e, !0);
    }
    Ue.boolOrEmptySchema = ac;
    function Un(t, e) {
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
        (0, tc.reportError)(n, nc, void 0, e);
    }
});
var Lr = g((Ve) => {
    'use strict';
    Object.defineProperty(Ve, '__esModule', { value: !0 });
    Ve.getRules = Ve.isJSONType = void 0;
    var ic = ['string', 'number', 'integer', 'boolean', 'null', 'object', 'array'],
        cc = new Set(ic);
    function uc(t) {
        return typeof t == 'string' && cc.has(t);
    }
    Ve.isJSONType = uc;
    function dc() {
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
    Ve.getRules = dc;
});
var zr = g((ve) => {
    'use strict';
    Object.defineProperty(ve, '__esModule', { value: !0 });
    ve.shouldUseRule = ve.shouldUseGroup = ve.schemaHasRulesForType = void 0;
    function lc({ schema: t, self: e }, r) {
        let s = e.RULES.types[r];
        return s && s !== !0 && xn(t, s);
    }
    ve.schemaHasRulesForType = lc;
    function xn(t, e) {
        return e.rules.some((r) => Ln(t, r));
    }
    ve.shouldUseGroup = xn;
    function Ln(t, e) {
        var r;
        return (
            t[e.keyword] !== void 0 ||
            ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((s) => t[s] !== void 0))
        );
    }
    ve.shouldUseRule = Ln;
});
var at = g((K) => {
    'use strict';
    Object.defineProperty(K, '__esModule', { value: !0 });
    K.reportTypeError =
        K.checkDataTypes =
        K.checkDataType =
        K.coerceAndCheckDataType =
        K.getJSONTypes =
        K.getSchemaTypes =
        K.DataType =
            void 0;
    var fc = Lr(),
        hc = zr(),
        pc = ot(),
        E = S(),
        zn = T(),
        xe;
    (function (t) {
        (t[(t.Correct = 0)] = 'Correct'), (t[(t.Wrong = 1)] = 'Wrong');
    })(xe || (K.DataType = xe = {}));
    function mc(t) {
        let e = Fn(t.type);
        if (e.includes('null')) {
            if (t.nullable === !1) throw new Error('type: null contradicts nullable: false');
        } else {
            if (!e.length && t.nullable !== void 0) throw new Error('"nullable" cannot be used without "type"');
            t.nullable === !0 && e.push('null');
        }
        return e;
    }
    K.getSchemaTypes = mc;
    function Fn(t) {
        let e = Array.isArray(t) ? t : t ? [t] : [];
        if (e.every(fc.isJSONType)) return e;
        throw new Error(`type must be JSONType or JSONType[]: ${e.join(',')}`);
    }
    K.getJSONTypes = Fn;
    function yc(t, e) {
        let { gen: r, data: s, opts: n } = t,
            o = gc(e, n.coerceTypes),
            a = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, hc.schemaHasRulesForType)(t, e[0]));
        if (a) {
            let i = Kr(e, s, n.strictNumbers, xe.Wrong);
            r.if(i, () => {
                o.length ? _c(t, e, o) : Hr(t);
            });
        }
        return a;
    }
    K.coerceAndCheckDataType = yc;
    var Kn = new Set(['string', 'number', 'integer', 'boolean', 'null']);
    function gc(t, e) {
        return e ? t.filter((r) => Kn.has(r) || (e === 'array' && r === 'array')) : [];
    }
    function _c(t, e, r) {
        let { gen: s, data: n, opts: o } = t,
            a = s.let('dataType', (0, E._)`typeof ${n}`),
            i = s.let('coerced', (0, E._)`undefined`);
        o.coerceTypes === 'array' &&
            s.if((0, E._)`${a} == 'object' && Array.isArray(${n}) && ${n}.length == 1`, () =>
                s
                    .assign(n, (0, E._)`${n}[0]`)
                    .assign(a, (0, E._)`typeof ${n}`)
                    .if(Kr(e, n, o.strictNumbers), () => s.assign(i, n)),
            ),
            s.if((0, E._)`${i} !== undefined`);
        for (let u of r) (Kn.has(u) || (u === 'array' && o.coerceTypes === 'array')) && c(u);
        s.else(),
            Hr(t),
            s.endIf(),
            s.if((0, E._)`${i} !== undefined`, () => {
                s.assign(n, i), vc(t, i);
            });
        function c(u) {
            switch (u) {
                case 'string':
                    s.elseIf((0, E._)`${a} == "number" || ${a} == "boolean"`)
                        .assign(i, (0, E._)`"" + ${n}`)
                        .elseIf((0, E._)`${n} === null`)
                        .assign(i, (0, E._)`""`);
                    return;
                case 'number':
                    s.elseIf(
                        (0, E._)`${a} == "boolean" || ${n} === null
              || (${a} == "string" && ${n} && ${n} == +${n})`,
                    ).assign(i, (0, E._)`+${n}`);
                    return;
                case 'integer':
                    s.elseIf(
                        (0, E._)`${a} === "boolean" || ${n} === null
              || (${a} === "string" && ${n} && ${n} == +${n} && !(${n} % 1))`,
                    ).assign(i, (0, E._)`+${n}`);
                    return;
                case 'boolean':
                    s.elseIf((0, E._)`${n} === "false" || ${n} === 0 || ${n} === null`)
                        .assign(i, !1)
                        .elseIf((0, E._)`${n} === "true" || ${n} === 1`)
                        .assign(i, !0);
                    return;
                case 'null':
                    s.elseIf((0, E._)`${n} === "" || ${n} === 0 || ${n} === false`), s.assign(i, null);
                    return;
                case 'array':
                    s.elseIf(
                        (0, E._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${n} === null`,
                    ).assign(i, (0, E._)`[${n}]`);
            }
        }
    }
    function vc({ gen: t, parentData: e, parentDataProperty: r }, s) {
        t.if((0, E._)`${e} !== undefined`, () => t.assign((0, E._)`${e}[${r}]`, s));
    }
    function Fr(t, e, r, s = xe.Correct) {
        let n = s === xe.Correct ? E.operators.EQ : E.operators.NEQ,
            o;
        switch (t) {
            case 'null':
                return (0, E._)`${e} ${n} null`;
            case 'array':
                o = (0, E._)`Array.isArray(${e})`;
                break;
            case 'object':
                o = (0, E._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
                break;
            case 'integer':
                o = a((0, E._)`!(${e} % 1) && !isNaN(${e})`);
                break;
            case 'number':
                o = a();
                break;
            default:
                return (0, E._)`typeof ${e} ${n} ${t}`;
        }
        return s === xe.Correct ? o : (0, E.not)(o);
        function a(i = E.nil) {
            return (0, E.and)((0, E._)`typeof ${e} == "number"`, i, r ? (0, E._)`isFinite(${e})` : E.nil);
        }
    }
    K.checkDataType = Fr;
    function Kr(t, e, r, s) {
        if (t.length === 1) return Fr(t[0], e, r, s);
        let n,
            o = (0, zn.toHash)(t);
        if (o.array && o.object) {
            let a = (0, E._)`typeof ${e} != "object"`;
            (n = o.null ? a : (0, E._)`!${e} || ${a}`), delete o.null, delete o.array, delete o.object;
        } else n = E.nil;
        o.number && delete o.integer;
        for (let a in o) n = (0, E.and)(n, Fr(a, e, r, s));
        return n;
    }
    K.checkDataTypes = Kr;
    var $c = {
        message: ({ schema: t }) => `must be ${t}`,
        params: ({ schema: t, schemaValue: e }) =>
            typeof t == 'string' ? (0, E._)`{type: ${t}}` : (0, E._)`{type: ${e}}`,
    };
    function Hr(t) {
        let e = wc(t);
        (0, pc.reportError)(e, $c);
    }
    K.reportTypeError = Hr;
    function wc(t) {
        let { gen: e, data: r, schema: s } = t,
            n = (0, zn.schemaRefOrVal)(t, s, 'type');
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
var Gn = g((Vt) => {
    'use strict';
    Object.defineProperty(Vt, '__esModule', { value: !0 });
    Vt.assignDefaults = void 0;
    var Le = S(),
        Ec = T();
    function bc(t, e) {
        let { properties: r, items: s } = t.schema;
        if (e === 'object' && r) for (let n in r) Hn(t, n, r[n].default);
        else e === 'array' && Array.isArray(s) && s.forEach((n, o) => Hn(t, o, n.default));
    }
    Vt.assignDefaults = bc;
    function Hn(t, e, r) {
        let { gen: s, compositeRule: n, data: o, opts: a } = t;
        if (r === void 0) return;
        let i = (0, Le._)`${o}${(0, Le.getProperty)(e)}`;
        if (n) {
            (0, Ec.checkStrictMode)(t, `default is ignored for: ${i}`);
            return;
        }
        let c = (0, Le._)`${i} === undefined`;
        a.useDefaults === 'empty' && (c = (0, Le._)`${c} || ${i} === null || ${i} === ""`),
            s.if(c, (0, Le._)`${i} = ${(0, Le.stringify)(r)}`);
    }
});
var Y = g((q) => {
    'use strict';
    Object.defineProperty(q, '__esModule', { value: !0 });
    q.validateUnion =
        q.validateArray =
        q.usePattern =
        q.callValidateCode =
        q.schemaProperties =
        q.allSchemaProperties =
        q.noPropertyInData =
        q.propertyInData =
        q.isOwnProperty =
        q.hasPropFunc =
        q.reportMissingProp =
        q.checkMissingProp =
        q.checkReportMissingProp =
            void 0;
    var j = S(),
        Gr = T(),
        $e = me(),
        Sc = T();
    function Pc(t, e) {
        let { gen: r, data: s, it: n } = t;
        r.if(Wr(r, s, e, n.opts.ownProperties), () => {
            t.setParams({ missingProperty: (0, j._)`${e}` }, !0), t.error();
        });
    }
    q.checkReportMissingProp = Pc;
    function Nc({ gen: t, data: e, it: { opts: r } }, s, n) {
        return (0, j.or)(...s.map((o) => (0, j.and)(Wr(t, e, o, r.ownProperties), (0, j._)`${n} = ${o}`)));
    }
    q.checkMissingProp = Nc;
    function Ic(t, e) {
        t.setParams({ missingProperty: e }, !0), t.error();
    }
    q.reportMissingProp = Ic;
    function Jn(t) {
        return t.scopeValue('func', {
            ref: Object.prototype.hasOwnProperty,
            code: (0, j._)`Object.prototype.hasOwnProperty`,
        });
    }
    q.hasPropFunc = Jn;
    function Jr(t, e, r) {
        return (0, j._)`${Jn(t)}.call(${e}, ${r})`;
    }
    q.isOwnProperty = Jr;
    function Rc(t, e, r, s) {
        let n = (0, j._)`${e}${(0, j.getProperty)(r)} !== undefined`;
        return s ? (0, j._)`${n} && ${Jr(t, e, r)}` : n;
    }
    q.propertyInData = Rc;
    function Wr(t, e, r, s) {
        let n = (0, j._)`${e}${(0, j.getProperty)(r)} === undefined`;
        return s ? (0, j.or)(n, (0, j.not)(Jr(t, e, r))) : n;
    }
    q.noPropertyInData = Wr;
    function Wn(t) {
        return t ? Object.keys(t).filter((e) => e !== '__proto__') : [];
    }
    q.allSchemaProperties = Wn;
    function Oc(t, e) {
        return Wn(e).filter((r) => !(0, Gr.alwaysValidSchema)(t, e[r]));
    }
    q.schemaProperties = Oc;
    function kc(
        { schemaCode: t, data: e, it: { gen: r, topSchemaRef: s, schemaPath: n, errorPath: o }, it: a },
        i,
        c,
        u,
    ) {
        let d = u ? (0, j._)`${t}, ${e}, ${s}${n}` : e,
            l = [
                [$e.default.instancePath, (0, j.strConcat)($e.default.instancePath, o)],
                [$e.default.parentData, a.parentData],
                [$e.default.parentDataProperty, a.parentDataProperty],
                [$e.default.rootData, $e.default.rootData],
            ];
        a.opts.dynamicRef && l.push([$e.default.dynamicAnchors, $e.default.dynamicAnchors]);
        let y = (0, j._)`${d}, ${r.object(...l)}`;
        return c !== j.nil ? (0, j._)`${i}.call(${c}, ${y})` : (0, j._)`${i}(${y})`;
    }
    q.callValidateCode = kc;
    var Tc = (0, j._)`new RegExp`;
    function qc({ gen: t, it: { opts: e } }, r) {
        let s = e.unicodeRegExp ? 'u' : '',
            { regExp: n } = e.code,
            o = n(r, s);
        return t.scopeValue('pattern', {
            key: o.toString(),
            ref: o,
            code: (0, j._)`${n.code === 'new RegExp' ? Tc : (0, Sc.useFunc)(t, n)}(${r}, ${s})`,
        });
    }
    q.usePattern = qc;
    function Ac(t) {
        let { gen: e, data: r, keyword: s, it: n } = t,
            o = e.name('valid');
        if (n.allErrors) {
            let i = e.let('valid', !0);
            return a(() => e.assign(i, !1)), i;
        }
        return e.var(o, !0), a(() => e.break()), o;
        function a(i) {
            let c = e.const('len', (0, j._)`${r}.length`);
            e.forRange('i', 0, c, (u) => {
                t.subschema({ keyword: s, dataProp: u, dataPropType: Gr.Type.Num }, o), e.if((0, j.not)(o), i);
            });
        }
    }
    q.validateArray = Ac;
    function Cc(t) {
        let { gen: e, schema: r, keyword: s, it: n } = t;
        if (!Array.isArray(r)) throw new Error('ajv implementation error');
        if (r.some((c) => (0, Gr.alwaysValidSchema)(n, c)) && !n.opts.unevaluated) return;
        let a = e.let('valid', !1),
            i = e.name('_valid');
        e.block(() =>
            r.forEach((c, u) => {
                let d = t.subschema({ keyword: s, schemaProp: u, compositeRule: !0 }, i);
                e.assign(a, (0, j._)`${a} || ${i}`), t.mergeValidEvaluated(d, i) || e.if((0, j.not)(a));
            }),
        ),
            t.result(
                a,
                () => t.reset(),
                () => t.error(!0),
            );
    }
    q.validateUnion = Cc;
});
var Xn = g((ie) => {
    'use strict';
    Object.defineProperty(ie, '__esModule', { value: !0 });
    ie.validateKeywordUsage = ie.validSchemaType = ie.funcKeywordCode = ie.macroKeywordCode = void 0;
    var G = S(),
        Te = me(),
        jc = Y(),
        Mc = ot();
    function Dc(t, e) {
        let { gen: r, keyword: s, schema: n, parentSchema: o, it: a } = t,
            i = e.macro.call(a.self, n, o, a),
            c = Qn(r, s, i);
        a.opts.validateSchema !== !1 && a.self.validateSchema(i, !0);
        let u = r.name('valid');
        t.subschema(
            {
                schema: i,
                schemaPath: G.nil,
                errSchemaPath: `${a.errSchemaPath}/${s}`,
                topSchemaRef: c,
                compositeRule: !0,
            },
            u,
        ),
            t.pass(u, () => t.error(!0));
    }
    ie.macroKeywordCode = Dc;
    function Uc(t, e) {
        var r;
        let { gen: s, keyword: n, schema: o, parentSchema: a, $data: i, it: c } = t;
        xc(c, e);
        let u = !i && e.compile ? e.compile.call(c.self, o, a, c) : e.validate,
            d = Qn(s, n, u),
            l = s.let('valid');
        t.block$data(l, y), t.ok((r = e.valid) !== null && r !== void 0 ? r : l);
        function y() {
            if (e.errors === !1) f(), e.modifying && Bn(t), p(() => t.error());
            else {
                let _ = e.async ? m() : h();
                e.modifying && Bn(t), p(() => Vc(t, _));
            }
        }
        function m() {
            let _ = s.let('ruleErrs', null);
            return (
                s.try(
                    () => f((0, G._)`await `),
                    (R) =>
                        s.assign(l, !1).if(
                            (0, G._)`${R} instanceof ${c.ValidationError}`,
                            () => s.assign(_, (0, G._)`${R}.errors`),
                            () => s.throw(R),
                        ),
                ),
                _
            );
        }
        function h() {
            let _ = (0, G._)`${d}.errors`;
            return s.assign(_, null), f(G.nil), _;
        }
        function f(_ = e.async ? (0, G._)`await ` : G.nil) {
            let R = c.opts.passContext ? Te.default.this : Te.default.self,
                N = !(('compile' in e && !i) || e.schema === !1);
            s.assign(l, (0, G._)`${_}${(0, jc.callValidateCode)(t, d, R, N)}`, e.modifying);
        }
        function p(_) {
            var R;
            s.if((0, G.not)((R = e.valid) !== null && R !== void 0 ? R : l), _);
        }
    }
    ie.funcKeywordCode = Uc;
    function Bn(t) {
        let { gen: e, data: r, it: s } = t;
        e.if(s.parentData, () => e.assign(r, (0, G._)`${s.parentData}[${s.parentDataProperty}]`));
    }
    function Vc(t, e) {
        let { gen: r } = t;
        r.if(
            (0, G._)`Array.isArray(${e})`,
            () => {
                r
                    .assign(
                        Te.default.vErrors,
                        (0, G._)`${Te.default.vErrors} === null ? ${e} : ${Te.default.vErrors}.concat(${e})`,
                    )
                    .assign(Te.default.errors, (0, G._)`${Te.default.vErrors}.length`),
                    (0, Mc.extendErrors)(t);
            },
            () => t.error(),
        );
    }
    function xc({ schemaEnv: t }, e) {
        if (e.async && !t.$async) throw new Error('async keyword in sync schema');
    }
    function Qn(t, e, r) {
        if (r === void 0) throw new Error(`keyword "${e}" failed to compile`);
        return t.scopeValue('keyword', typeof r == 'function' ? { ref: r } : { ref: r, code: (0, G.stringify)(r) });
    }
    function Lc(t, e, r = !1) {
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
    ie.validSchemaType = Lc;
    function zc({ schema: t, opts: e, self: r, errSchemaPath: s }, n, o) {
        if (Array.isArray(n.keyword) ? !n.keyword.includes(o) : n.keyword !== o)
            throw new Error('ajv implementation error');
        let a = n.dependencies;
        if (a?.some((i) => !Object.prototype.hasOwnProperty.call(t, i)))
            throw new Error(`parent schema must have dependencies of ${o}: ${a.join(',')}`);
        if (n.validateSchema && !n.validateSchema(t[o])) {
            let c = `keyword "${o}" value is invalid at path "${s}": ${r.errorsText(n.validateSchema.errors)}`;
            if (e.validateSchema === 'log') r.logger.error(c);
            else throw new Error(c);
        }
    }
    ie.validateKeywordUsage = zc;
});
var Zn = g((we) => {
    'use strict';
    Object.defineProperty(we, '__esModule', { value: !0 });
    we.extendSubschemaMode = we.extendSubschemaData = we.getSubschema = void 0;
    var ce = S(),
        Yn = T();
    function Fc(t, { keyword: e, schemaProp: r, schema: s, schemaPath: n, errSchemaPath: o, topSchemaRef: a }) {
        if (e !== void 0 && s !== void 0) throw new Error('both "keyword" and "schema" passed, only one allowed');
        if (e !== void 0) {
            let i = t.schema[e];
            return r === void 0
                ? {
                      schema: i,
                      schemaPath: (0, ce._)`${t.schemaPath}${(0, ce.getProperty)(e)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}`,
                  }
                : {
                      schema: i[r],
                      schemaPath: (0, ce._)`${t.schemaPath}${(0, ce.getProperty)(e)}${(0, ce.getProperty)(r)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Yn.escapeFragment)(r)}`,
                  };
        }
        if (s !== void 0) {
            if (n === void 0 || o === void 0 || a === void 0)
                throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return { schema: s, schemaPath: n, topSchemaRef: a, errSchemaPath: o };
        }
        throw new Error('either "keyword" or "schema" must be passed');
    }
    we.getSubschema = Fc;
    function Kc(t, e, { dataProp: r, dataPropType: s, data: n, dataTypes: o, propertyName: a }) {
        if (n !== void 0 && r !== void 0) throw new Error('both "data" and "dataProp" passed, only one allowed');
        let { gen: i } = e;
        if (r !== void 0) {
            let { errorPath: u, dataPathArr: d, opts: l } = e,
                y = i.let('data', (0, ce._)`${e.data}${(0, ce.getProperty)(r)}`, !0);
            c(y),
                (t.errorPath = (0, ce.str)`${u}${(0, Yn.getErrorPath)(r, s, l.jsPropertySyntax)}`),
                (t.parentDataProperty = (0, ce._)`${r}`),
                (t.dataPathArr = [...d, t.parentDataProperty]);
        }
        if (n !== void 0) {
            let u = n instanceof ce.Name ? n : i.let('data', n, !0);
            c(u), a !== void 0 && (t.propertyName = a);
        }
        o && (t.dataTypes = o);
        function c(u) {
            (t.data = u),
                (t.dataLevel = e.dataLevel + 1),
                (t.dataTypes = []),
                (e.definedProperties = new Set()),
                (t.parentData = e.data),
                (t.dataNames = [...e.dataNames, u]);
        }
    }
    we.extendSubschemaData = Kc;
    function Hc(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: s, createErrors: n, allErrors: o }) {
        s !== void 0 && (t.compositeRule = s),
            n !== void 0 && (t.createErrors = n),
            o !== void 0 && (t.allErrors = o),
            (t.jtdDiscriminator = e),
            (t.jtdMetadata = r);
    }
    we.extendSubschemaMode = Hc;
});
var Br = g((ip, eo) => {
    'use strict';
    eo.exports = function t(e, r) {
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
var ro = g((cp, to) => {
    'use strict';
    var Ee = (to.exports = function (t, e, r) {
        typeof e == 'function' && ((r = e), (e = {})), (r = e.cb || r);
        var s = typeof r == 'function' ? r : r.pre || function () {},
            n = r.post || function () {};
        xt(e, s, n, t, '', t);
    });
    Ee.keywords = {
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
    Ee.arrayKeywords = { items: !0, allOf: !0, anyOf: !0, oneOf: !0 };
    Ee.propsKeywords = { $defs: !0, definitions: !0, properties: !0, patternProperties: !0, dependencies: !0 };
    Ee.skipKeywords = {
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
    function xt(t, e, r, s, n, o, a, i, c, u) {
        if (s && typeof s == 'object' && !Array.isArray(s)) {
            e(s, n, o, a, i, c, u);
            for (var d in s) {
                var l = s[d];
                if (Array.isArray(l)) {
                    if (d in Ee.arrayKeywords)
                        for (var y = 0; y < l.length; y++) xt(t, e, r, l[y], `${n}/${d}/${y}`, o, n, d, s, y);
                } else if (d in Ee.propsKeywords) {
                    if (l && typeof l == 'object')
                        for (var m in l) xt(t, e, r, l[m], `${n}/${d}/${Gc(m)}`, o, n, d, s, m);
                } else
                    (d in Ee.keywords || (t.allKeys && !(d in Ee.skipKeywords))) &&
                        xt(t, e, r, l, `${n}/${d}`, o, n, d, s);
            }
            r(s, n, o, a, i, c, u);
        }
    }
    function Gc(t) {
        return t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
});
var it = g((B) => {
    'use strict';
    Object.defineProperty(B, '__esModule', { value: !0 });
    B.getSchemaRefs = B.resolveUrl = B.normalizeId = B._getFullPath = B.getFullPath = B.inlineRef = void 0;
    var Jc = T(),
        Wc = Br(),
        Bc = ro(),
        Qc = new Set([
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
    function Xc(t, e = !0) {
        return typeof t == 'boolean' ? !0 : e === !0 ? !Qr(t) : e ? so(t) <= e : !1;
    }
    B.inlineRef = Xc;
    var Yc = new Set(['$ref', '$recursiveRef', '$recursiveAnchor', '$dynamicRef', '$dynamicAnchor']);
    function Qr(t) {
        for (let e in t) {
            if (Yc.has(e)) return !0;
            let r = t[e];
            if ((Array.isArray(r) && r.some(Qr)) || (typeof r == 'object' && Qr(r))) return !0;
        }
        return !1;
    }
    function so(t) {
        let e = 0;
        for (let r in t) {
            if (r === '$ref') return 1 / 0;
            if (
                (e++,
                !Qc.has(r) && (typeof t[r] == 'object' && (0, Jc.eachItem)(t[r], (s) => (e += so(s))), e === 1 / 0))
            )
                return 1 / 0;
        }
        return e;
    }
    function no(t, e = '', r) {
        r !== !1 && (e = ze(e));
        let s = t.parse(e);
        return oo(t, s);
    }
    B.getFullPath = no;
    function oo(t, e) {
        return `${t.serialize(e).split('#')[0]}#`;
    }
    B._getFullPath = oo;
    var Zc = /#\/?$/;
    function ze(t) {
        return t ? t.replace(Zc, '') : '';
    }
    B.normalizeId = ze;
    function eu(t, e, r) {
        return (r = ze(r)), t.resolve(e, r);
    }
    B.resolveUrl = eu;
    var tu = /^[a-z_][-a-z0-9._]*$/i;
    function ru(t, e) {
        if (typeof t == 'boolean') return {};
        let { schemaId: r, uriResolver: s } = this.opts,
            n = ze(t[r] || e),
            o = { '': n },
            a = no(s, n, !1),
            i = {},
            c = new Set();
        return (
            Bc(t, { allKeys: !0 }, (l, y, m, h) => {
                if (h === void 0) return;
                let f = a + y,
                    p = o[h];
                typeof l[r] == 'string' && (p = _.call(this, l[r])),
                    R.call(this, l.$anchor),
                    R.call(this, l.$dynamicAnchor),
                    (o[y] = p);
                function _(N) {
                    let C = this.opts.uriResolver.resolve;
                    if (((N = ze(p ? C(p, N) : N)), c.has(N))) throw d(N);
                    c.add(N);
                    let w = this.refs[N];
                    return (
                        typeof w == 'string' && (w = this.refs[w]),
                        typeof w == 'object'
                            ? u(l, w.schema, N)
                            : N !== ze(f) && (N[0] === '#' ? (u(l, i[N], N), (i[N] = l)) : (this.refs[N] = f)),
                        N
                    );
                }
                function R(N) {
                    if (typeof N == 'string') {
                        if (!tu.test(N)) throw new Error(`invalid anchor "${N}"`);
                        _.call(this, `#${N}`);
                    }
                }
            }),
            i
        );
        function u(l, y, m) {
            if (y !== void 0 && !Wc(l, y)) throw d(m);
        }
        function d(l) {
            return new Error(`reference "${l}" resolves to more than one schema`);
        }
    }
    B.getSchemaRefs = ru;
});
var dt = g((be) => {
    'use strict';
    Object.defineProperty(be, '__esModule', { value: !0 });
    be.getData = be.KeywordCxt = be.validateFunctionCode = void 0;
    var lo = Vn(),
        ao = at(),
        Yr = zr(),
        Lt = at(),
        su = Gn(),
        ut = Xn(),
        Xr = Zn(),
        v = S(),
        $ = me(),
        nu = it(),
        ye = T(),
        ct = ot();
    function ou(t) {
        if (po(t) && (mo(t), ho(t))) {
            cu(t);
            return;
        }
        fo(t, () => (0, lo.topBoolOrEmptySchema)(t));
    }
    be.validateFunctionCode = ou;
    function fo({ gen: t, validateName: e, schema: r, schemaEnv: s, opts: n }, o) {
        n.code.es5
            ? t.func(e, (0, v._)`${$.default.data}, ${$.default.valCxt}`, s.$async, () => {
                  t.code((0, v._)`"use strict"; ${io(r, n)}`), iu(t, n), t.code(o);
              })
            : t.func(e, (0, v._)`${$.default.data}, ${au(n)}`, s.$async, () => t.code(io(r, n)).code(o));
    }
    function au(t) {
        return (0,
        v._)`{${$.default.instancePath}="", ${$.default.parentData}, ${$.default.parentDataProperty}, ${$.default.rootData}=${$.default.data}${t.dynamicRef ? (0, v._)`, ${$.default.dynamicAnchors}={}` : v.nil}}={}`;
    }
    function iu(t, e) {
        t.if(
            $.default.valCxt,
            () => {
                t.var($.default.instancePath, (0, v._)`${$.default.valCxt}.${$.default.instancePath}`),
                    t.var($.default.parentData, (0, v._)`${$.default.valCxt}.${$.default.parentData}`),
                    t.var($.default.parentDataProperty, (0, v._)`${$.default.valCxt}.${$.default.parentDataProperty}`),
                    t.var($.default.rootData, (0, v._)`${$.default.valCxt}.${$.default.rootData}`),
                    e.dynamicRef &&
                        t.var($.default.dynamicAnchors, (0, v._)`${$.default.valCxt}.${$.default.dynamicAnchors}`);
            },
            () => {
                t.var($.default.instancePath, (0, v._)`""`),
                    t.var($.default.parentData, (0, v._)`undefined`),
                    t.var($.default.parentDataProperty, (0, v._)`undefined`),
                    t.var($.default.rootData, $.default.data),
                    e.dynamicRef && t.var($.default.dynamicAnchors, (0, v._)`{}`);
            },
        );
    }
    function cu(t) {
        let { schema: e, opts: r, gen: s } = t;
        fo(t, () => {
            r.$comment && e.$comment && go(t),
                hu(t),
                s.let($.default.vErrors, null),
                s.let($.default.errors, 0),
                r.unevaluated && uu(t),
                yo(t),
                yu(t);
        });
    }
    function uu(t) {
        let { gen: e, validateName: r } = t;
        (t.evaluated = e.const('evaluated', (0, v._)`${r}.evaluated`)),
            e.if((0, v._)`${t.evaluated}.dynamicProps`, () =>
                e.assign((0, v._)`${t.evaluated}.props`, (0, v._)`undefined`),
            ),
            e.if((0, v._)`${t.evaluated}.dynamicItems`, () =>
                e.assign((0, v._)`${t.evaluated}.items`, (0, v._)`undefined`),
            );
    }
    function io(t, e) {
        let r = typeof t == 'object' && t[e.schemaId];
        return r && (e.code.source || e.code.process) ? (0, v._)`/*# sourceURL=${r} */` : v.nil;
    }
    function du(t, e) {
        if (po(t) && (mo(t), ho(t))) {
            lu(t, e);
            return;
        }
        (0, lo.boolOrEmptySchema)(t, e);
    }
    function ho({ schema: t, self: e }) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e.RULES.all[r]) return !0;
        return !1;
    }
    function po(t) {
        return typeof t.schema != 'boolean';
    }
    function lu(t, e) {
        let { schema: r, gen: s, opts: n } = t;
        n.$comment && r.$comment && go(t), pu(t), mu(t);
        let o = s.const('_errs', $.default.errors);
        yo(t, o), s.var(e, (0, v._)`${o} === ${$.default.errors}`);
    }
    function mo(t) {
        (0, ye.checkUnknownRules)(t), fu(t);
    }
    function yo(t, e) {
        if (t.opts.jtd) return co(t, [], !1, e);
        let r = (0, ao.getSchemaTypes)(t.schema),
            s = (0, ao.coerceAndCheckDataType)(t, r);
        co(t, r, !s, e);
    }
    function fu(t) {
        let { schema: e, errSchemaPath: r, opts: s, self: n } = t;
        e.$ref &&
            s.ignoreKeywordsWithRef &&
            (0, ye.schemaHasRulesButRef)(e, n.RULES) &&
            n.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
    }
    function hu(t) {
        let { schema: e, opts: r } = t;
        e.default !== void 0 &&
            r.useDefaults &&
            r.strictSchema &&
            (0, ye.checkStrictMode)(t, 'default is ignored in the schema root');
    }
    function pu(t) {
        let e = t.schema[t.opts.schemaId];
        e && (t.baseId = (0, nu.resolveUrl)(t.opts.uriResolver, t.baseId, e));
    }
    function mu(t) {
        if (t.schema.$async && !t.schemaEnv.$async) throw new Error('async schema in sync schema');
    }
    function go({ gen: t, schemaEnv: e, schema: r, errSchemaPath: s, opts: n }) {
        let o = r.$comment;
        if (n.$comment === !0) t.code((0, v._)`${$.default.self}.logger.log(${o})`);
        else if (typeof n.$comment == 'function') {
            let a = (0, v.str)`${s}/$comment`,
                i = t.scopeValue('root', { ref: e.root });
            t.code((0, v._)`${$.default.self}.opts.$comment(${o}, ${a}, ${i}.schema)`);
        }
    }
    function yu(t) {
        let { gen: e, schemaEnv: r, validateName: s, ValidationError: n, opts: o } = t;
        r.$async
            ? e.if(
                  (0, v._)`${$.default.errors} === 0`,
                  () => e.return($.default.data),
                  () => e.throw((0, v._)`new ${n}(${$.default.vErrors})`),
              )
            : (e.assign((0, v._)`${s}.errors`, $.default.vErrors),
              o.unevaluated && gu(t),
              e.return((0, v._)`${$.default.errors} === 0`));
    }
    function gu({ gen: t, evaluated: e, props: r, items: s }) {
        r instanceof v.Name && t.assign((0, v._)`${e}.props`, r),
            s instanceof v.Name && t.assign((0, v._)`${e}.items`, s);
    }
    function co(t, e, r, s) {
        let { gen: n, schema: o, data: a, allErrors: i, opts: c, self: u } = t,
            { RULES: d } = u;
        if (o.$ref && (c.ignoreKeywordsWithRef || !(0, ye.schemaHasRulesButRef)(o, d))) {
            n.block(() => vo(t, '$ref', d.all.$ref.definition));
            return;
        }
        c.jtd || _u(t, e),
            n.block(() => {
                for (let y of d.rules) l(y);
                l(d.post);
            });
        function l(y) {
            (0, Yr.shouldUseGroup)(o, y) &&
                (y.type
                    ? (n.if((0, Lt.checkDataType)(y.type, a, c.strictNumbers)),
                      uo(t, y),
                      e.length === 1 && e[0] === y.type && r && (n.else(), (0, Lt.reportTypeError)(t)),
                      n.endIf())
                    : uo(t, y),
                i || n.if((0, v._)`${$.default.errors} === ${s || 0}`));
        }
    }
    function uo(t, e) {
        let {
            gen: r,
            schema: s,
            opts: { useDefaults: n },
        } = t;
        n && (0, su.assignDefaults)(t, e.type),
            r.block(() => {
                for (let o of e.rules) (0, Yr.shouldUseRule)(s, o) && vo(t, o.keyword, o.definition, e.type);
            });
    }
    function _u(t, e) {
        t.schemaEnv.meta || !t.opts.strictTypes || (vu(t, e), t.opts.allowUnionTypes || $u(t, e), wu(t, t.dataTypes));
    }
    function vu(t, e) {
        if (e.length) {
            if (!t.dataTypes.length) {
                t.dataTypes = e;
                return;
            }
            e.forEach((r) => {
                _o(t.dataTypes, r) || Zr(t, `type "${r}" not allowed by context "${t.dataTypes.join(',')}"`);
            }),
                bu(t, e);
        }
    }
    function $u(t, e) {
        e.length > 1 &&
            !(e.length === 2 && e.includes('null')) &&
            Zr(t, 'use allowUnionTypes to allow union type keyword');
    }
    function wu(t, e) {
        let r = t.self.RULES.all;
        for (let s in r) {
            let n = r[s];
            if (typeof n == 'object' && (0, Yr.shouldUseRule)(t.schema, n)) {
                let { type: o } = n.definition;
                o.length && !o.some((a) => Eu(e, a)) && Zr(t, `missing type "${o.join(',')}" for keyword "${s}"`);
            }
        }
    }
    function Eu(t, e) {
        return t.includes(e) || (e === 'number' && t.includes('integer'));
    }
    function _o(t, e) {
        return t.includes(e) || (e === 'integer' && t.includes('number'));
    }
    function bu(t, e) {
        let r = [];
        for (let s of t.dataTypes) _o(e, s) ? r.push(s) : e.includes('integer') && s === 'number' && r.push('integer');
        t.dataTypes = r;
    }
    function Zr(t, e) {
        let r = t.schemaEnv.baseId + t.errSchemaPath;
        (e += ` at "${r}" (strictTypes)`), (0, ye.checkStrictMode)(t, e, t.opts.strictTypes);
    }
    var zt = class {
        constructor(e, r, s) {
            if (
                ((0, ut.validateKeywordUsage)(e, r, s),
                (this.gen = e.gen),
                (this.allErrors = e.allErrors),
                (this.keyword = s),
                (this.data = e.data),
                (this.schema = e.schema[s]),
                (this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data),
                (this.schemaValue = (0, ye.schemaRefOrVal)(e, this.schema, s, this.$data)),
                (this.schemaType = r.schemaType),
                (this.parentSchema = e.schema),
                (this.params = {}),
                (this.it = e),
                (this.def = r),
                this.$data)
            )
                this.schemaCode = e.gen.const('vSchema', $o(this.$data, e));
            else if (
                ((this.schemaCode = this.schemaValue),
                !(0, ut.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
            )
                throw new Error(`${s} value must be ${JSON.stringify(r.schemaType)}`);
            ('code' in r ? r.trackErrors : r.errors !== !1) &&
                (this.errsCount = e.gen.const('_errs', $.default.errors));
        }
        result(e, r, s) {
            this.failResult((0, v.not)(e), r, s);
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
            this.failResult((0, v.not)(e), void 0, r);
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
            this.fail((0, v._)`${r} !== undefined && (${(0, v.or)(this.invalid$data(), e)})`);
        }
        error(e, r, s) {
            if (r) {
                this.setParams(r), this._error(e, s), this.setParams({});
                return;
            }
            this._error(e, s);
        }
        _error(e, r) {
            (e ? ct.reportExtraError : ct.reportError)(this, this.def.error, r);
        }
        $dataError() {
            (0, ct.reportError)(this, this.def.$dataError || ct.keyword$DataError);
        }
        reset() {
            if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
            (0, ct.resetErrorsCount)(this.gen, this.errsCount);
        }
        ok(e) {
            this.allErrors || this.gen.if(e);
        }
        setParams(e, r) {
            r ? Object.assign(this.params, e) : (this.params = e);
        }
        block$data(e, r, s = v.nil) {
            this.gen.block(() => {
                this.check$data(e, s), r();
            });
        }
        check$data(e = v.nil, r = v.nil) {
            if (!this.$data) return;
            let { gen: s, schemaCode: n, schemaType: o, def: a } = this;
            s.if((0, v.or)((0, v._)`${n} === undefined`, r)),
                e !== v.nil && s.assign(e, !0),
                (o.length || a.validateSchema) &&
                    (s.elseIf(this.invalid$data()), this.$dataError(), e !== v.nil && s.assign(e, !1)),
                s.else();
        }
        invalid$data() {
            let { gen: e, schemaCode: r, schemaType: s, def: n, it: o } = this;
            return (0, v.or)(a(), i());
            function a() {
                if (s.length) {
                    if (!(r instanceof v.Name)) throw new Error('ajv implementation error');
                    let c = Array.isArray(s) ? s : [s];
                    return (0, v._)`${(0, Lt.checkDataTypes)(c, r, o.opts.strictNumbers, Lt.DataType.Wrong)}`;
                }
                return v.nil;
            }
            function i() {
                if (n.validateSchema) {
                    let c = e.scopeValue('validate$data', { ref: n.validateSchema });
                    return (0, v._)`!${c}(${r})`;
                }
                return v.nil;
            }
        }
        subschema(e, r) {
            let s = (0, Xr.getSubschema)(this.it, e);
            (0, Xr.extendSubschemaData)(s, this.it, e), (0, Xr.extendSubschemaMode)(s, e);
            let n = { ...this.it, ...s, items: void 0, props: void 0 };
            return du(n, r), n;
        }
        mergeEvaluated(e, r) {
            let { it: s, gen: n } = this;
            s.opts.unevaluated &&
                (s.props !== !0 && e.props !== void 0 && (s.props = ye.mergeEvaluated.props(n, e.props, s.props, r)),
                s.items !== !0 && e.items !== void 0 && (s.items = ye.mergeEvaluated.items(n, e.items, s.items, r)));
        }
        mergeValidEvaluated(e, r) {
            let { it: s, gen: n } = this;
            if (s.opts.unevaluated && (s.props !== !0 || s.items !== !0))
                return n.if(r, () => this.mergeEvaluated(e, v.Name)), !0;
        }
    };
    be.KeywordCxt = zt;
    function vo(t, e, r, s) {
        let n = new zt(t, r, e);
        'code' in r
            ? r.code(n, s)
            : n.$data && r.validate
              ? (0, ut.funcKeywordCode)(n, r)
              : 'macro' in r
                ? (0, ut.macroKeywordCode)(n, r)
                : (r.compile || r.validate) && (0, ut.funcKeywordCode)(n, r);
    }
    var Su = /^\/(?:[^~]|~0|~1)*$/,
        Pu = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function $o(t, { dataLevel: e, dataNames: r, dataPathArr: s }) {
        let n, o;
        if (t === '') return $.default.rootData;
        if (t[0] === '/') {
            if (!Su.test(t)) throw new Error(`Invalid JSON-pointer: ${t}`);
            (n = t), (o = $.default.rootData);
        } else {
            let u = Pu.exec(t);
            if (!u) throw new Error(`Invalid JSON-pointer: ${t}`);
            let d = +u[1];
            if (((n = u[2]), n === '#')) {
                if (d >= e) throw new Error(c('property/index', d));
                return s[e - d];
            }
            if (d > e) throw new Error(c('data', d));
            if (((o = r[e - d]), !n)) return o;
        }
        let a = o,
            i = n.split('/');
        for (let u of i)
            u &&
                ((o = (0, v._)`${o}${(0, v.getProperty)((0, ye.unescapeJsonPointer)(u))}`),
                (a = (0, v._)`${a} && ${o}`));
        return a;
        function c(u, d) {
            return `Cannot access ${u} ${d} levels up, current level is ${e}`;
        }
    }
    be.getData = $o;
});
var Ft = g((ts) => {
    'use strict';
    Object.defineProperty(ts, '__esModule', { value: !0 });
    var es = class extends Error {
        constructor(e) {
            super('validation failed'), (this.errors = e), (this.ajv = this.validation = !0);
        }
    };
    ts.default = es;
});
var lt = g((ns) => {
    'use strict';
    Object.defineProperty(ns, '__esModule', { value: !0 });
    var rs = it(),
        ss = class extends Error {
            constructor(e, r, s, n) {
                super(n || `can't resolve reference ${s} from id ${r}`),
                    (this.missingRef = (0, rs.resolveUrl)(e, r, s)),
                    (this.missingSchema = (0, rs.normalizeId)((0, rs.getFullPath)(e, this.missingRef)));
            }
        };
    ns.default = ss;
});
var Ht = g((Z) => {
    'use strict';
    Object.defineProperty(Z, '__esModule', { value: !0 });
    Z.resolveSchema = Z.getCompilingSchema = Z.resolveRef = Z.compileSchema = Z.SchemaEnv = void 0;
    var re = S(),
        Nu = Ft(),
        qe = me(),
        se = it(),
        wo = T(),
        Iu = dt(),
        Fe = class {
            constructor(e) {
                var r;
                (this.refs = {}), (this.dynamicAnchors = {});
                let s;
                typeof e.schema == 'object' && (s = e.schema),
                    (this.schema = e.schema),
                    (this.schemaId = e.schemaId),
                    (this.root = e.root || this),
                    (this.baseId =
                        (r = e.baseId) !== null && r !== void 0 ? r : (0, se.normalizeId)(s?.[e.schemaId || '$id'])),
                    (this.schemaPath = e.schemaPath),
                    (this.localRefs = e.localRefs),
                    (this.meta = e.meta),
                    (this.$async = s?.$async),
                    (this.refs = {});
            }
        };
    Z.SchemaEnv = Fe;
    function as(t) {
        let e = Eo.call(this, t);
        if (e) return e;
        let r = (0, se.getFullPath)(this.opts.uriResolver, t.root.baseId),
            { es5: s, lines: n } = this.opts.code,
            { ownProperties: o } = this.opts,
            a = new re.CodeGen(this.scope, { es5: s, lines: n, ownProperties: o }),
            i;
        t.$async &&
            (i = a.scopeValue('Error', {
                ref: Nu.default,
                code: (0, re._)`require("ajv/dist/runtime/validation_error").default`,
            }));
        let c = a.scopeName('validate');
        t.validateName = c;
        let u = {
                gen: a,
                allErrors: this.opts.allErrors,
                data: qe.default.data,
                parentData: qe.default.parentData,
                parentDataProperty: qe.default.parentDataProperty,
                dataNames: [qe.default.data],
                dataPathArr: [re.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set(),
                topSchemaRef: a.scopeValue(
                    'schema',
                    this.opts.code.source === !0
                        ? { ref: t.schema, code: (0, re.stringify)(t.schema) }
                        : { ref: t.schema },
                ),
                validateName: c,
                ValidationError: i,
                schema: t.schema,
                schemaEnv: t,
                rootId: r,
                baseId: t.baseId || r,
                schemaPath: re.nil,
                errSchemaPath: t.schemaPath || (this.opts.jtd ? '' : '#'),
                errorPath: (0, re._)`""`,
                opts: this.opts,
                self: this,
            },
            d;
        try {
            this._compilations.add(t), (0, Iu.validateFunctionCode)(u), a.optimize(this.opts.code.optimize);
            let l = a.toString();
            (d = `${a.scopeRefs(qe.default.scope)}return ${l}`),
                this.opts.code.process && (d = this.opts.code.process(d, t));
            let m = new Function(`${qe.default.self}`, `${qe.default.scope}`, d)(this, this.scope.get());
            if (
                (this.scope.value(c, { ref: m }),
                (m.errors = null),
                (m.schema = t.schema),
                (m.schemaEnv = t),
                t.$async && (m.$async = !0),
                this.opts.code.source === !0 &&
                    (m.source = { validateName: c, validateCode: l, scopeValues: a._values }),
                this.opts.unevaluated)
            ) {
                let { props: h, items: f } = u;
                (m.evaluated = {
                    props: h instanceof re.Name ? void 0 : h,
                    items: f instanceof re.Name ? void 0 : f,
                    dynamicProps: h instanceof re.Name,
                    dynamicItems: f instanceof re.Name,
                }),
                    m.source && (m.source.evaluated = (0, re.stringify)(m.evaluated));
            }
            return (t.validate = m), t;
        } catch (l) {
            throw (
                (delete t.validate,
                delete t.validateName,
                d && this.logger.error('Error compiling schema, function code:', d),
                l)
            );
        } finally {
            this._compilations.delete(t);
        }
    }
    Z.compileSchema = as;
    function Ru(t, e, r) {
        var s;
        r = (0, se.resolveUrl)(this.opts.uriResolver, e, r);
        let n = t.refs[r];
        if (n) return n;
        let o = Tu.call(this, t, r);
        if (o === void 0) {
            let a = (s = t.localRefs) === null || s === void 0 ? void 0 : s[r],
                { schemaId: i } = this.opts;
            a && (o = new Fe({ schema: a, schemaId: i, root: t, baseId: e }));
        }
        if (o !== void 0) return (t.refs[r] = Ou.call(this, o));
    }
    Z.resolveRef = Ru;
    function Ou(t) {
        return (0, se.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : as.call(this, t);
    }
    function Eo(t) {
        for (let e of this._compilations) if (ku(e, t)) return e;
    }
    Z.getCompilingSchema = Eo;
    function ku(t, e) {
        return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
    }
    function Tu(t, e) {
        let r;
        for (; typeof (r = this.refs[e]) == 'string'; ) e = r;
        return r || this.schemas[e] || Kt.call(this, t, e);
    }
    function Kt(t, e) {
        let r = this.opts.uriResolver.parse(e),
            s = (0, se._getFullPath)(this.opts.uriResolver, r),
            n = (0, se.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
        if (Object.keys(t.schema).length > 0 && s === n) return os.call(this, r, t);
        let o = (0, se.normalizeId)(s),
            a = this.refs[o] || this.schemas[o];
        if (typeof a == 'string') {
            let i = Kt.call(this, t, a);
            return typeof i?.schema != 'object' ? void 0 : os.call(this, r, i);
        }
        if (typeof a?.schema == 'object') {
            if ((a.validate || as.call(this, a), o === (0, se.normalizeId)(e))) {
                let { schema: i } = a,
                    { schemaId: c } = this.opts,
                    u = i[c];
                return (
                    u && (n = (0, se.resolveUrl)(this.opts.uriResolver, n, u)),
                    new Fe({ schema: i, schemaId: c, root: t, baseId: n })
                );
            }
            return os.call(this, r, a);
        }
    }
    Z.resolveSchema = Kt;
    var qu = new Set(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
    function os(t, { baseId: e, schema: r, root: s }) {
        var n;
        if (((n = t.fragment) === null || n === void 0 ? void 0 : n[0]) !== '/') return;
        for (let i of t.fragment.slice(1).split('/')) {
            if (typeof r == 'boolean') return;
            let c = r[(0, wo.unescapeFragment)(i)];
            if (c === void 0) return;
            r = c;
            let u = typeof r == 'object' && r[this.opts.schemaId];
            !qu.has(i) && u && (e = (0, se.resolveUrl)(this.opts.uriResolver, e, u));
        }
        let o;
        if (typeof r != 'boolean' && r.$ref && !(0, wo.schemaHasRulesButRef)(r, this.RULES)) {
            let i = (0, se.resolveUrl)(this.opts.uriResolver, e, r.$ref);
            o = Kt.call(this, s, i);
        }
        let { schemaId: a } = this.opts;
        if (((o = o || new Fe({ schema: r, schemaId: a, root: s, baseId: e })), o.schema !== o.root.schema)) return o;
    }
});
var bo = g((pp, Au) => {
    Au.exports = {
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
var Po = g((mp, So) => {
    'use strict';
    var Cu = {
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
    So.exports = { HEX: Cu };
});
var Ao = g((yp, qo) => {
    'use strict';
    var { HEX: ju } = Po();
    function Oo(t) {
        if (To(t, '.') < 3) return { host: t, isIPV4: !1 };
        let e =
                t.match(
                    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u,
                ) || [],
            [r] = e;
        return r ? { host: Du(r, '.'), isIPV4: !0 } : { host: t, isIPV4: !1 };
    }
    function is(t, e = !1) {
        let r = '',
            s = !0;
        for (let n of t) {
            if (ju[n] === void 0) return;
            n !== '0' && s === !0 && (s = !1), s || (r += n);
        }
        return e && r.length === 0 && (r = '0'), r;
    }
    function Mu(t) {
        let e = 0,
            r = { error: !1, address: '', zone: '' },
            s = [],
            n = [],
            o = !1,
            a = !1,
            i = !1;
        function c() {
            if (n.length) {
                if (o === !1) {
                    let u = is(n);
                    if (u !== void 0) s.push(u);
                    else return (r.error = !0), !1;
                }
                n.length = 0;
            }
            return !0;
        }
        for (let u = 0; u < t.length; u++) {
            let d = t[u];
            if (!(d === '[' || d === ']'))
                if (d === ':') {
                    if ((a === !0 && (i = !0), !c())) break;
                    if ((e++, s.push(':'), e > 7)) {
                        r.error = !0;
                        break;
                    }
                    u - 1 >= 0 && t[u - 1] === ':' && (a = !0);
                    continue;
                } else if (d === '%') {
                    if (!c()) break;
                    o = !0;
                } else {
                    n.push(d);
                    continue;
                }
        }
        return (
            n.length && (o ? (r.zone = n.join('')) : i ? s.push(n.join('')) : s.push(is(n))),
            (r.address = s.join('')),
            r
        );
    }
    function ko(t, e = {}) {
        if (To(t, ':') < 2) return { host: t, isIPV6: !1 };
        let r = Mu(t);
        if (r.error) return { host: t, isIPV6: !1 };
        {
            let s = r.address,
                n = r.address;
            return r.zone && ((s += `%${r.zone}`), (n += `%25${r.zone}`)), { host: s, escapedHost: n, isIPV6: !0 };
        }
    }
    function Du(t, e) {
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
    function To(t, e) {
        let r = 0;
        for (let s = 0; s < t.length; s++) t[s] === e && r++;
        return r;
    }
    var No = /^\.\.?\//u,
        Io = /^\/\.(?:\/|$)/u,
        Ro = /^\/\.\.(?:\/|$)/u,
        Uu = /^\/?(?:.|\n)*?(?=\/|$)/u;
    function Vu(t) {
        let e = [];
        for (; t.length; )
            if (t.match(No)) t = t.replace(No, '');
            else if (t.match(Io)) t = t.replace(Io, '/');
            else if (t.match(Ro)) (t = t.replace(Ro, '/')), e.pop();
            else if (t === '.' || t === '..') t = '';
            else {
                let r = t.match(Uu);
                if (r) {
                    let s = r[0];
                    (t = t.slice(s.length)), e.push(s);
                } else throw new Error('Unexpected dot segment condition');
            }
        return e.join('');
    }
    function xu(t, e) {
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
    function Lu(t, e) {
        let r = [];
        if ((t.userinfo !== void 0 && (r.push(t.userinfo), r.push('@')), t.host !== void 0)) {
            let s = unescape(t.host),
                n = Oo(s);
            if (n.isIPV4) s = n.host;
            else {
                let o = ko(n.host, { isIPV4: !1 });
                o.isIPV6 === !0 ? (s = `[${o.escapedHost}]`) : (s = t.host);
            }
            r.push(s);
        }
        return (
            (typeof t.port == 'number' || typeof t.port == 'string') && (r.push(':'), r.push(String(t.port))),
            r.length ? r.join('') : void 0
        );
    }
    qo.exports = {
        recomposeAuthority: Lu,
        normalizeComponentEncoding: xu,
        removeDotSegments: Vu,
        normalizeIPv4: Oo,
        normalizeIPv6: ko,
        stringArrayToHexStripped: is,
    };
});
var Vo = g((gp, Uo) => {
    'use strict';
    var zu = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu,
        Fu = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    function Co(t) {
        return typeof t.secure == 'boolean' ? t.secure : String(t.scheme).toLowerCase() === 'wss';
    }
    function jo(t) {
        return t.host || (t.error = t.error || 'HTTP URIs must have a host.'), t;
    }
    function Mo(t) {
        let e = String(t.scheme).toLowerCase() === 'https';
        return (t.port === (e ? 443 : 80) || t.port === '') && (t.port = void 0), t.path || (t.path = '/'), t;
    }
    function Ku(t) {
        return (
            (t.secure = Co(t)),
            (t.resourceName = (t.path || '/') + (t.query ? `?${t.query}` : '')),
            (t.path = void 0),
            (t.query = void 0),
            t
        );
    }
    function Hu(t) {
        if (
            ((t.port === (Co(t) ? 443 : 80) || t.port === '') && (t.port = void 0),
            typeof t.secure == 'boolean' && ((t.scheme = t.secure ? 'wss' : 'ws'), (t.secure = void 0)),
            t.resourceName)
        ) {
            let [e, r] = t.resourceName.split('?');
            (t.path = e && e !== '/' ? e : void 0), (t.query = r), (t.resourceName = void 0);
        }
        return (t.fragment = void 0), t;
    }
    function Gu(t, e) {
        if (!t.path) return (t.error = 'URN can not be parsed'), t;
        let r = t.path.match(Fu);
        if (r) {
            let s = e.scheme || t.scheme || 'urn';
            (t.nid = r[1].toLowerCase()), (t.nss = r[2]);
            let n = `${s}:${e.nid || t.nid}`,
                o = cs[n];
            (t.path = void 0), o && (t = o.parse(t, e));
        } else t.error = t.error || 'URN can not be parsed.';
        return t;
    }
    function Ju(t, e) {
        let r = e.scheme || t.scheme || 'urn',
            s = t.nid.toLowerCase(),
            n = `${r}:${e.nid || s}`,
            o = cs[n];
        o && (t = o.serialize(t, e));
        let a = t,
            i = t.nss;
        return (a.path = `${s || e.nid}:${i}`), (e.skipEscape = !0), a;
    }
    function Wu(t, e) {
        let r = t;
        return (
            (r.uuid = r.nss),
            (r.nss = void 0),
            !e.tolerant && (!r.uuid || !zu.test(r.uuid)) && (r.error = r.error || 'UUID is not valid.'),
            r
        );
    }
    function Bu(t) {
        let e = t;
        return (e.nss = (t.uuid || '').toLowerCase()), e;
    }
    var Do = { scheme: 'http', domainHost: !0, parse: jo, serialize: Mo },
        Qu = { scheme: 'https', domainHost: Do.domainHost, parse: jo, serialize: Mo },
        Gt = { scheme: 'ws', domainHost: !0, parse: Ku, serialize: Hu },
        Xu = { scheme: 'wss', domainHost: Gt.domainHost, parse: Gt.parse, serialize: Gt.serialize },
        Yu = { scheme: 'urn', parse: Gu, serialize: Ju, skipNormalize: !0 },
        Zu = { scheme: 'urn:uuid', parse: Wu, serialize: Bu, skipNormalize: !0 },
        cs = { http: Do, https: Qu, ws: Gt, wss: Xu, urn: Yu, 'urn:uuid': Zu };
    Uo.exports = cs;
});
var Lo = g((_p, Wt) => {
    'use strict';
    var {
            normalizeIPv6: ed,
            normalizeIPv4: td,
            removeDotSegments: ft,
            recomposeAuthority: rd,
            normalizeComponentEncoding: Jt,
        } = Ao(),
        us = Vo();
    function sd(t, e) {
        return typeof t == 'string' ? (t = ue(ge(t, e), e)) : typeof t == 'object' && (t = ge(ue(t, e), e)), t;
    }
    function nd(t, e, r) {
        let s = Object.assign({ scheme: 'null' }, r),
            n = xo(ge(t, s), ge(e, s), s, !0);
        return ue(n, { ...s, skipEscape: !0 });
    }
    function xo(t, e, r, s) {
        let n = {};
        return (
            s || ((t = ge(ue(t, r), r)), (e = ge(ue(e, r), r))),
            (r = r || {}),
            !r.tolerant && e.scheme
                ? ((n.scheme = e.scheme),
                  (n.userinfo = e.userinfo),
                  (n.host = e.host),
                  (n.port = e.port),
                  (n.path = ft(e.path || '')),
                  (n.query = e.query))
                : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0
                      ? ((n.userinfo = e.userinfo),
                        (n.host = e.host),
                        (n.port = e.port),
                        (n.path = ft(e.path || '')),
                        (n.query = e.query))
                      : (e.path
                            ? (e.path.charAt(0) === '/'
                                  ? (n.path = ft(e.path))
                                  : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path
                                        ? (n.path = `/${e.path}`)
                                        : t.path
                                          ? (n.path = t.path.slice(0, t.path.lastIndexOf('/') + 1) + e.path)
                                          : (n.path = e.path),
                                    (n.path = ft(n.path))),
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
    function od(t, e, r) {
        return (
            typeof t == 'string'
                ? ((t = unescape(t)), (t = ue(Jt(ge(t, r), !0), { ...r, skipEscape: !0 })))
                : typeof t == 'object' && (t = ue(Jt(t, !0), { ...r, skipEscape: !0 })),
            typeof e == 'string'
                ? ((e = unescape(e)), (e = ue(Jt(ge(e, r), !0), { ...r, skipEscape: !0 })))
                : typeof e == 'object' && (e = ue(Jt(e, !0), { ...r, skipEscape: !0 })),
            t.toLowerCase() === e.toLowerCase()
        );
    }
    function ue(t, e) {
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
            o = us[(s.scheme || r.scheme || '').toLowerCase()];
        o && o.serialize && o.serialize(r, s),
            r.path !== void 0 &&
                (s.skipEscape
                    ? (r.path = unescape(r.path))
                    : ((r.path = escape(r.path)), r.scheme !== void 0 && (r.path = r.path.split('%3A').join(':')))),
            s.reference !== 'suffix' && r.scheme && (n.push(r.scheme), n.push(':'));
        let a = rd(r, s);
        if (
            (a !== void 0 &&
                (s.reference !== 'suffix' && n.push('//'),
                n.push(a),
                r.path && r.path.charAt(0) !== '/' && n.push('/')),
            r.path !== void 0)
        ) {
            let i = r.path;
            !s.absolutePath && (!o || !o.absolutePath) && (i = ft(i)),
                a === void 0 && (i = i.replace(/^\/\//u, '/%2F')),
                n.push(i);
        }
        return (
            r.query !== void 0 && (n.push('?'), n.push(r.query)),
            r.fragment !== void 0 && (n.push('#'), n.push(r.fragment)),
            n.join('')
        );
    }
    var ad = Array.from({ length: 127 }, (t, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
    function id(t) {
        let e = 0;
        for (let r = 0, s = t.length; r < s; ++r) if (((e = t.charCodeAt(r)), e > 126 || ad[e])) return !0;
        return !1;
    }
    var cd =
        /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function ge(t, e) {
        let r = Object.assign({}, e),
            s = { scheme: void 0, userinfo: void 0, host: '', port: void 0, path: '', query: void 0, fragment: void 0 },
            n = t.indexOf('%') !== -1,
            o = !1;
        r.reference === 'suffix' && (t = `${r.scheme ? `${r.scheme}:` : ''}//${t}`);
        let a = t.match(cd);
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
                let c = td(s.host);
                if (c.isIPV4 === !1) {
                    let u = ed(c.host, { isIPV4: !1 });
                    (s.host = u.host.toLowerCase()), (o = u.isIPV6);
                } else (s.host = c.host), (o = !0);
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
            let i = us[(r.scheme || s.scheme || '').toLowerCase()];
            if (
                !r.unicodeSupport &&
                (!i || !i.unicodeSupport) &&
                s.host &&
                (r.domainHost || (i && i.domainHost)) &&
                o === !1 &&
                id(s.host)
            )
                try {
                    s.host = URL.domainToASCII(s.host.toLowerCase());
                } catch (c) {
                    s.error = s.error || `Host's domain name can not be converted to ASCII: ${c}`;
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
    var ds = { SCHEMES: us, normalize: sd, resolve: nd, resolveComponents: xo, equal: od, serialize: ue, parse: ge };
    Wt.exports = ds;
    Wt.exports.default = ds;
    Wt.exports.fastUri = ds;
});
var Fo = g((ls) => {
    'use strict';
    Object.defineProperty(ls, '__esModule', { value: !0 });
    var zo = Lo();
    zo.code = 'require("ajv/dist/runtime/uri").default';
    ls.default = zo;
});
var Xo = g((x) => {
    'use strict';
    Object.defineProperty(x, '__esModule', { value: !0 });
    x.CodeGen = x.Name = x.nil = x.stringify = x.str = x._ = x.KeywordCxt = void 0;
    var ud = dt();
    Object.defineProperty(x, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return ud.KeywordCxt;
        },
    });
    var Ke = S();
    Object.defineProperty(x, '_', {
        enumerable: !0,
        get: function () {
            return Ke._;
        },
    });
    Object.defineProperty(x, 'str', {
        enumerable: !0,
        get: function () {
            return Ke.str;
        },
    });
    Object.defineProperty(x, 'stringify', {
        enumerable: !0,
        get: function () {
            return Ke.stringify;
        },
    });
    Object.defineProperty(x, 'nil', {
        enumerable: !0,
        get: function () {
            return Ke.nil;
        },
    });
    Object.defineProperty(x, 'Name', {
        enumerable: !0,
        get: function () {
            return Ke.Name;
        },
    });
    Object.defineProperty(x, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return Ke.CodeGen;
        },
    });
    var dd = Ft(),
        Wo = lt(),
        ld = Lr(),
        ht = Ht(),
        fd = S(),
        pt = it(),
        Bt = at(),
        hs = T(),
        Ko = bo(),
        hd = Fo(),
        Bo = (t, e) => new RegExp(t, e);
    Bo.code = 'new RegExp';
    var pd = ['removeAdditional', 'useDefaults', 'coerceTypes'],
        md = new Set([
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
        yd = {
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
        gd = {
            ignoreKeywordsWithRef: '',
            jsPropertySyntax: '',
            unicode: '"minLength"/"maxLength" account for unicode characters by default.',
        },
        Ho = 200;
    function _d(t) {
        var e, r, s, n, o, a, i, c, u, d, l, y, m, h, f, p, _, R, N, C, w, oe, le, lr, fr;
        let Qe = t.strict,
            hr = (e = t.code) === null || e === void 0 ? void 0 : e.optimize,
            sn = hr === !0 || hr === void 0 ? 1 : hr || 0,
            nn = (s = (r = t.code) === null || r === void 0 ? void 0 : r.regExp) !== null && s !== void 0 ? s : Bo,
            ci = (n = t.uriResolver) !== null && n !== void 0 ? n : hd.default;
        return {
            strictSchema:
                (a = (o = t.strictSchema) !== null && o !== void 0 ? o : Qe) !== null && a !== void 0 ? a : !0,
            strictNumbers:
                (c = (i = t.strictNumbers) !== null && i !== void 0 ? i : Qe) !== null && c !== void 0 ? c : !0,
            strictTypes:
                (d = (u = t.strictTypes) !== null && u !== void 0 ? u : Qe) !== null && d !== void 0 ? d : 'log',
            strictTuples:
                (y = (l = t.strictTuples) !== null && l !== void 0 ? l : Qe) !== null && y !== void 0 ? y : 'log',
            strictRequired:
                (h = (m = t.strictRequired) !== null && m !== void 0 ? m : Qe) !== null && h !== void 0 ? h : !1,
            code: t.code ? { ...t.code, optimize: sn, regExp: nn } : { optimize: sn, regExp: nn },
            loopRequired: (f = t.loopRequired) !== null && f !== void 0 ? f : Ho,
            loopEnum: (p = t.loopEnum) !== null && p !== void 0 ? p : Ho,
            meta: (_ = t.meta) !== null && _ !== void 0 ? _ : !0,
            messages: (R = t.messages) !== null && R !== void 0 ? R : !0,
            inlineRefs: (N = t.inlineRefs) !== null && N !== void 0 ? N : !0,
            schemaId: (C = t.schemaId) !== null && C !== void 0 ? C : '$id',
            addUsedSchema: (w = t.addUsedSchema) !== null && w !== void 0 ? w : !0,
            validateSchema: (oe = t.validateSchema) !== null && oe !== void 0 ? oe : !0,
            validateFormats: (le = t.validateFormats) !== null && le !== void 0 ? le : !0,
            unicodeRegExp: (lr = t.unicodeRegExp) !== null && lr !== void 0 ? lr : !0,
            int32range: (fr = t.int32range) !== null && fr !== void 0 ? fr : !0,
            uriResolver: ci,
        };
    }
    var mt = class {
        constructor(e = {}) {
            (this.schemas = {}),
                (this.refs = {}),
                (this.formats = {}),
                (this._compilations = new Set()),
                (this._loading = {}),
                (this._cache = new Map()),
                (e = this.opts = { ...e, ..._d(e) });
            let { es5: r, lines: s } = this.opts.code;
            (this.scope = new fd.ValueScope({ scope: {}, prefixes: md, es5: r, lines: s })),
                (this.logger = Sd(e.logger));
            let n = e.validateFormats;
            (e.validateFormats = !1),
                (this.RULES = (0, ld.getRules)()),
                Go.call(this, yd, e, 'NOT SUPPORTED'),
                Go.call(this, gd, e, 'DEPRECATED', 'warn'),
                (this._metaOpts = Ed.call(this)),
                e.formats && $d.call(this),
                this._addVocabularies(),
                this._addDefaultMetaSchema(),
                e.keywords && wd.call(this, e.keywords),
                typeof e.meta == 'object' && this.addMetaSchema(e.meta),
                vd.call(this),
                (e.validateFormats = n);
        }
        _addVocabularies() {
            this.addKeyword('$async');
        }
        _addDefaultMetaSchema() {
            let { $data: e, meta: r, schemaId: s } = this.opts,
                n = Ko;
            s === 'id' && ((n = { ...Ko }), (n.id = n.$id), delete n.$id), r && e && this.addMetaSchema(n, n[s], !1);
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
            async function n(d, l) {
                await o.call(this, d.$schema);
                let y = this._addSchema(d, l);
                return y.validate || a.call(this, y);
            }
            async function o(d) {
                d && !this.getSchema(d) && (await n.call(this, { $ref: d }, !0));
            }
            async function a(d) {
                try {
                    return this._compileSchemaEnv(d);
                } catch (l) {
                    if (!(l instanceof Wo.default)) throw l;
                    return i.call(this, l), await c.call(this, l.missingSchema), a.call(this, d);
                }
            }
            function i({ missingSchema: d, missingRef: l }) {
                if (this.refs[d]) throw new Error(`AnySchema ${d} is loaded but ${l} cannot be resolved`);
            }
            async function c(d) {
                let l = await u.call(this, d);
                this.refs[d] || (await o.call(this, l.$schema)), this.refs[d] || this.addSchema(l, d, r);
            }
            async function u(d) {
                let l = this._loading[d];
                if (l) return l;
                try {
                    return await (this._loading[d] = s(d));
                } finally {
                    delete this._loading[d];
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
                (r = (0, pt.normalizeId)(r || o)),
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
            for (; typeof (r = Jo.call(this, e)) == 'string'; ) e = r;
            if (r === void 0) {
                let { schemaId: s } = this.opts,
                    n = new ht.SchemaEnv({ schema: {}, schemaId: s });
                if (((r = ht.resolveSchema.call(this, n, e)), !r)) return;
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
                    let r = Jo.call(this, e);
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
                    return s && ((s = (0, pt.normalizeId)(s)), delete this.schemas[s], delete this.refs[s]), this;
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
            if ((Nd.call(this, s, r), !r)) return (0, hs.eachItem)(s, (o) => fs.call(this, o)), this;
            Rd.call(this, r);
            let n = { ...r, type: (0, Bt.getJSONTypes)(r.type), schemaType: (0, Bt.getJSONTypes)(r.schemaType) };
            return (
                (0, hs.eachItem)(
                    s,
                    n.type.length === 0
                        ? (o) => fs.call(this, o, n)
                        : (o) => n.type.forEach((a) => fs.call(this, o, n, a)),
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
                    let c = s[i];
                    if (typeof c != 'object') continue;
                    let { $data: u } = c.definition,
                        d = a[i];
                    u && d && (a[i] = Qo(d));
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
            let c = this._cache.get(e);
            if (c !== void 0) return c;
            s = (0, pt.normalizeId)(a || s);
            let u = pt.getSchemaRefs.call(this, e, s);
            return (
                (c = new ht.SchemaEnv({ schema: e, schemaId: i, meta: r, baseId: s, localRefs: u })),
                this._cache.set(c.schema, c),
                o && !s.startsWith('#') && (s && this._checkUnique(s), (this.refs[s] = c)),
                n && this.validateSchema(e, !0),
                c
            );
        }
        _checkUnique(e) {
            if (this.schemas[e] || this.refs[e]) throw new Error(`schema with key or id "${e}" already exists`);
        }
        _compileSchemaEnv(e) {
            if ((e.meta ? this._compileMetaSchema(e) : ht.compileSchema.call(this, e), !e.validate))
                throw new Error('ajv implementation error');
            return e.validate;
        }
        _compileMetaSchema(e) {
            let r = this.opts;
            this.opts = this._metaOpts;
            try {
                ht.compileSchema.call(this, e);
            } finally {
                this.opts = r;
            }
        }
    };
    mt.ValidationError = dd.default;
    mt.MissingRefError = Wo.default;
    x.default = mt;
    function Go(t, e, r, s = 'error') {
        for (let n in t) {
            let o = n;
            o in e && this.logger[s](`${r}: option ${n}. ${t[o]}`);
        }
    }
    function Jo(t) {
        return (t = (0, pt.normalizeId)(t)), this.schemas[t] || this.refs[t];
    }
    function vd() {
        let t = this.opts.schemas;
        if (t)
            if (Array.isArray(t)) this.addSchema(t);
            else for (let e in t) this.addSchema(t[e], e);
    }
    function $d() {
        for (let t in this.opts.formats) {
            let e = this.opts.formats[t];
            e && this.addFormat(t, e);
        }
    }
    function wd(t) {
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
    function Ed() {
        let t = { ...this.opts };
        for (let e of pd) delete t[e];
        return t;
    }
    var bd = { log() {}, warn() {}, error() {} };
    function Sd(t) {
        if (t === !1) return bd;
        if (t === void 0) return console;
        if (t.log && t.warn && t.error) return t;
        throw new Error('logger must implement log, warn and error methods');
    }
    var Pd = /^[a-z_$][a-z0-9_$:-]*$/i;
    function Nd(t, e) {
        let { RULES: r } = this;
        if (
            ((0, hs.eachItem)(t, (s) => {
                if (r.keywords[s]) throw new Error(`Keyword ${s} is already defined`);
                if (!Pd.test(s)) throw new Error(`Keyword ${s} has invalid name`);
            }),
            !!e && e.$data && !('code' in e || 'validate' in e))
        )
            throw new Error('$data keyword must have "code" or "validate" function');
    }
    function fs(t, e, r) {
        var s;
        let n = e?.post;
        if (r && n) throw new Error('keyword with "post" flag cannot have "type"');
        let { RULES: o } = this,
            a = n ? o.post : o.rules.find(({ type: c }) => c === r);
        if ((a || ((a = { type: r, rules: [] }), o.rules.push(a)), (o.keywords[t] = !0), !e)) return;
        let i = {
            keyword: t,
            definition: { ...e, type: (0, Bt.getJSONTypes)(e.type), schemaType: (0, Bt.getJSONTypes)(e.schemaType) },
        };
        e.before ? Id.call(this, a, i, e.before) : a.rules.push(i),
            (o.all[t] = i),
            (s = e.implements) === null || s === void 0 || s.forEach((c) => this.addKeyword(c));
    }
    function Id(t, e, r) {
        let s = t.rules.findIndex((n) => n.keyword === r);
        s >= 0 ? t.rules.splice(s, 0, e) : (t.rules.push(e), this.logger.warn(`rule ${r} is not defined`));
    }
    function Rd(t) {
        let { metaSchema: e } = t;
        e !== void 0 && (t.$data && this.opts.$data && (e = Qo(e)), (t.validateSchema = this.compile(e, !0)));
    }
    var Od = { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' };
    function Qo(t) {
        return { anyOf: [t, Od] };
    }
});
var Yo = g((ps) => {
    'use strict';
    Object.defineProperty(ps, '__esModule', { value: !0 });
    var kd = {
        keyword: 'id',
        code() {
            throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
        },
    };
    ps.default = kd;
});
var ra = g((Ae) => {
    'use strict';
    Object.defineProperty(Ae, '__esModule', { value: !0 });
    Ae.callRef = Ae.getValidate = void 0;
    var Td = lt(),
        Zo = Y(),
        Q = S(),
        He = me(),
        ea = Ht(),
        Qt = T(),
        qd = {
            keyword: '$ref',
            schemaType: 'string',
            code(t) {
                let { gen: e, schema: r, it: s } = t,
                    { baseId: n, schemaEnv: o, validateName: a, opts: i, self: c } = s,
                    { root: u } = o;
                if ((r === '#' || r === '#/') && n === u.baseId) return l();
                let d = ea.resolveRef.call(c, u, n, r);
                if (d === void 0) throw new Td.default(s.opts.uriResolver, n, r);
                if (d instanceof ea.SchemaEnv) return y(d);
                return m(d);
                function l() {
                    if (o === u) return Xt(t, a, o, o.$async);
                    let h = e.scopeValue('root', { ref: u });
                    return Xt(t, (0, Q._)`${h}.validate`, u, u.$async);
                }
                function y(h) {
                    let f = ta(t, h);
                    Xt(t, f, h, h.$async);
                }
                function m(h) {
                    let f = e.scopeValue(
                            'schema',
                            i.code.source === !0 ? { ref: h, code: (0, Q.stringify)(h) } : { ref: h },
                        ),
                        p = e.name('valid'),
                        _ = t.subschema(
                            { schema: h, dataTypes: [], schemaPath: Q.nil, topSchemaRef: f, errSchemaPath: r },
                            p,
                        );
                    t.mergeEvaluated(_), t.ok(p);
                }
            },
        };
    function ta(t, e) {
        let { gen: r } = t;
        return e.validate
            ? r.scopeValue('validate', { ref: e.validate })
            : (0, Q._)`${r.scopeValue('wrapper', { ref: e })}.validate`;
    }
    Ae.getValidate = ta;
    function Xt(t, e, r, s) {
        let { gen: n, it: o } = t,
            { allErrors: a, schemaEnv: i, opts: c } = o,
            u = c.passContext ? He.default.this : Q.nil;
        s ? d() : l();
        function d() {
            if (!i.$async) throw new Error('async schema referenced by sync schema');
            let h = n.let('valid');
            n.try(
                () => {
                    n.code((0, Q._)`await ${(0, Zo.callValidateCode)(t, e, u)}`), m(e), a || n.assign(h, !0);
                },
                (f) => {
                    n.if((0, Q._)`!(${f} instanceof ${o.ValidationError})`, () => n.throw(f)),
                        y(f),
                        a || n.assign(h, !1);
                },
            ),
                t.ok(h);
        }
        function l() {
            t.result(
                (0, Zo.callValidateCode)(t, e, u),
                () => m(e),
                () => y(e),
            );
        }
        function y(h) {
            let f = (0, Q._)`${h}.errors`;
            n.assign(
                He.default.vErrors,
                (0, Q._)`${He.default.vErrors} === null ? ${f} : ${He.default.vErrors}.concat(${f})`,
            ),
                n.assign(He.default.errors, (0, Q._)`${He.default.vErrors}.length`);
        }
        function m(h) {
            var f;
            if (!o.opts.unevaluated) return;
            let p = (f = r?.validate) === null || f === void 0 ? void 0 : f.evaluated;
            if (o.props !== !0)
                if (p && !p.dynamicProps)
                    p.props !== void 0 && (o.props = Qt.mergeEvaluated.props(n, p.props, o.props));
                else {
                    let _ = n.var('props', (0, Q._)`${h}.evaluated.props`);
                    o.props = Qt.mergeEvaluated.props(n, _, o.props, Q.Name);
                }
            if (o.items !== !0)
                if (p && !p.dynamicItems)
                    p.items !== void 0 && (o.items = Qt.mergeEvaluated.items(n, p.items, o.items));
                else {
                    let _ = n.var('items', (0, Q._)`${h}.evaluated.items`);
                    o.items = Qt.mergeEvaluated.items(n, _, o.items, Q.Name);
                }
        }
    }
    Ae.callRef = Xt;
    Ae.default = qd;
});
var sa = g((ms) => {
    'use strict';
    Object.defineProperty(ms, '__esModule', { value: !0 });
    var Ad = Yo(),
        Cd = ra(),
        jd = ['$schema', '$id', '$defs', '$vocabulary', { keyword: '$comment' }, 'definitions', Ad.default, Cd.default];
    ms.default = jd;
});
var na = g((ys) => {
    'use strict';
    Object.defineProperty(ys, '__esModule', { value: !0 });
    var Yt = S(),
        Se = Yt.operators,
        Zt = {
            maximum: { okStr: '<=', ok: Se.LTE, fail: Se.GT },
            minimum: { okStr: '>=', ok: Se.GTE, fail: Se.LT },
            exclusiveMaximum: { okStr: '<', ok: Se.LT, fail: Se.GTE },
            exclusiveMinimum: { okStr: '>', ok: Se.GT, fail: Se.LTE },
        },
        Md = {
            message: ({ keyword: t, schemaCode: e }) => (0, Yt.str)`must be ${Zt[t].okStr} ${e}`,
            params: ({ keyword: t, schemaCode: e }) => (0, Yt._)`{comparison: ${Zt[t].okStr}, limit: ${e}}`,
        },
        Dd = {
            keyword: Object.keys(Zt),
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: Md,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t;
                t.fail$data((0, Yt._)`${r} ${Zt[e].fail} ${s} || isNaN(${r})`);
            },
        };
    ys.default = Dd;
});
var oa = g((gs) => {
    'use strict';
    Object.defineProperty(gs, '__esModule', { value: !0 });
    var yt = S(),
        Ud = {
            message: ({ schemaCode: t }) => (0, yt.str)`must be multiple of ${t}`,
            params: ({ schemaCode: t }) => (0, yt._)`{multipleOf: ${t}}`,
        },
        Vd = {
            keyword: 'multipleOf',
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: Ud,
            code(t) {
                let { gen: e, data: r, schemaCode: s, it: n } = t,
                    o = n.opts.multipleOfPrecision,
                    a = e.let('res'),
                    i = o ? (0, yt._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, yt._)`${a} !== parseInt(${a})`;
                t.fail$data((0, yt._)`(${s} === 0 || (${a} = ${r}/${s}, ${i}))`);
            },
        };
    gs.default = Vd;
});
var ia = g((_s) => {
    'use strict';
    Object.defineProperty(_s, '__esModule', { value: !0 });
    function aa(t) {
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
    _s.default = aa;
    aa.code = 'require("ajv/dist/runtime/ucs2length").default';
});
var ca = g((vs) => {
    'use strict';
    Object.defineProperty(vs, '__esModule', { value: !0 });
    var Ce = S(),
        xd = T(),
        Ld = ia(),
        zd = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxLength' ? 'more' : 'fewer';
                return (0, Ce.str)`must NOT have ${r} than ${e} characters`;
            },
            params: ({ schemaCode: t }) => (0, Ce._)`{limit: ${t}}`,
        },
        Fd = {
            keyword: ['maxLength', 'minLength'],
            type: 'string',
            schemaType: 'number',
            $data: !0,
            error: zd,
            code(t) {
                let { keyword: e, data: r, schemaCode: s, it: n } = t,
                    o = e === 'maxLength' ? Ce.operators.GT : Ce.operators.LT,
                    a =
                        n.opts.unicode === !1
                            ? (0, Ce._)`${r}.length`
                            : (0, Ce._)`${(0, xd.useFunc)(t.gen, Ld.default)}(${r})`;
                t.fail$data((0, Ce._)`${a} ${o} ${s}`);
            },
        };
    vs.default = Fd;
});
var ua = g(($s) => {
    'use strict';
    Object.defineProperty($s, '__esModule', { value: !0 });
    var Kd = Y(),
        er = S(),
        Hd = {
            message: ({ schemaCode: t }) => (0, er.str)`must match pattern "${t}"`,
            params: ({ schemaCode: t }) => (0, er._)`{pattern: ${t}}`,
        },
        Gd = {
            keyword: 'pattern',
            type: 'string',
            schemaType: 'string',
            $data: !0,
            error: Hd,
            code(t) {
                let { data: e, $data: r, schema: s, schemaCode: n, it: o } = t,
                    a = o.opts.unicodeRegExp ? 'u' : '',
                    i = r ? (0, er._)`(new RegExp(${n}, ${a}))` : (0, Kd.usePattern)(t, s);
                t.fail$data((0, er._)`!${i}.test(${e})`);
            },
        };
    $s.default = Gd;
});
var da = g((ws) => {
    'use strict';
    Object.defineProperty(ws, '__esModule', { value: !0 });
    var gt = S(),
        Jd = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxProperties' ? 'more' : 'fewer';
                return (0, gt.str)`must NOT have ${r} than ${e} properties`;
            },
            params: ({ schemaCode: t }) => (0, gt._)`{limit: ${t}}`,
        },
        Wd = {
            keyword: ['maxProperties', 'minProperties'],
            type: 'object',
            schemaType: 'number',
            $data: !0,
            error: Jd,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxProperties' ? gt.operators.GT : gt.operators.LT;
                t.fail$data((0, gt._)`Object.keys(${r}).length ${n} ${s}`);
            },
        };
    ws.default = Wd;
});
var la = g((Es) => {
    'use strict';
    Object.defineProperty(Es, '__esModule', { value: !0 });
    var _t = Y(),
        vt = S(),
        Bd = T(),
        Qd = {
            message: ({ params: { missingProperty: t } }) => (0, vt.str)`must have required property '${t}'`,
            params: ({ params: { missingProperty: t } }) => (0, vt._)`{missingProperty: ${t}}`,
        },
        Xd = {
            keyword: 'required',
            type: 'object',
            schemaType: 'array',
            $data: !0,
            error: Qd,
            code(t) {
                let { gen: e, schema: r, schemaCode: s, data: n, $data: o, it: a } = t,
                    { opts: i } = a;
                if (!o && r.length === 0) return;
                let c = r.length >= i.loopRequired;
                if ((a.allErrors ? u() : d(), i.strictRequired)) {
                    let m = t.parentSchema.properties,
                        { definedProperties: h } = t.it;
                    for (let f of r)
                        if (m?.[f] === void 0 && !h.has(f)) {
                            let p = a.schemaEnv.baseId + a.errSchemaPath,
                                _ = `required property "${f}" is not defined at "${p}" (strictRequired)`;
                            (0, Bd.checkStrictMode)(a, _, a.opts.strictRequired);
                        }
                }
                function u() {
                    if (c || o) t.block$data(vt.nil, l);
                    else for (let m of r) (0, _t.checkReportMissingProp)(t, m);
                }
                function d() {
                    let m = e.let('missing');
                    if (c || o) {
                        let h = e.let('valid', !0);
                        t.block$data(h, () => y(m, h)), t.ok(h);
                    } else e.if((0, _t.checkMissingProp)(t, r, m)), (0, _t.reportMissingProp)(t, m), e.else();
                }
                function l() {
                    e.forOf('prop', s, (m) => {
                        t.setParams({ missingProperty: m }),
                            e.if((0, _t.noPropertyInData)(e, n, m, i.ownProperties), () => t.error());
                    });
                }
                function y(m, h) {
                    t.setParams({ missingProperty: m }),
                        e.forOf(
                            m,
                            s,
                            () => {
                                e.assign(h, (0, _t.propertyInData)(e, n, m, i.ownProperties)),
                                    e.if((0, vt.not)(h), () => {
                                        t.error(), e.break();
                                    });
                            },
                            vt.nil,
                        );
                }
            },
        };
    Es.default = Xd;
});
var fa = g((bs) => {
    'use strict';
    Object.defineProperty(bs, '__esModule', { value: !0 });
    var $t = S(),
        Yd = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxItems' ? 'more' : 'fewer';
                return (0, $t.str)`must NOT have ${r} than ${e} items`;
            },
            params: ({ schemaCode: t }) => (0, $t._)`{limit: ${t}}`,
        },
        Zd = {
            keyword: ['maxItems', 'minItems'],
            type: 'array',
            schemaType: 'number',
            $data: !0,
            error: Yd,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxItems' ? $t.operators.GT : $t.operators.LT;
                t.fail$data((0, $t._)`${r}.length ${n} ${s}`);
            },
        };
    bs.default = Zd;
});
var tr = g((Ss) => {
    'use strict';
    Object.defineProperty(Ss, '__esModule', { value: !0 });
    var ha = Br();
    ha.code = 'require("ajv/dist/runtime/equal").default';
    Ss.default = ha;
});
var pa = g((Ns) => {
    'use strict';
    Object.defineProperty(Ns, '__esModule', { value: !0 });
    var Ps = at(),
        L = S(),
        el = T(),
        tl = tr(),
        rl = {
            message: ({ params: { i: t, j: e } }) =>
                (0, L.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
            params: ({ params: { i: t, j: e } }) => (0, L._)`{i: ${t}, j: ${e}}`,
        },
        sl = {
            keyword: 'uniqueItems',
            type: 'array',
            schemaType: 'boolean',
            $data: !0,
            error: rl,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, parentSchema: o, schemaCode: a, it: i } = t;
                if (!s && !n) return;
                let c = e.let('valid'),
                    u = o.items ? (0, Ps.getSchemaTypes)(o.items) : [];
                t.block$data(c, d, (0, L._)`${a} === false`), t.ok(c);
                function d() {
                    let h = e.let('i', (0, L._)`${r}.length`),
                        f = e.let('j');
                    t.setParams({ i: h, j: f }), e.assign(c, !0), e.if((0, L._)`${h} > 1`, () => (l() ? y : m)(h, f));
                }
                function l() {
                    return u.length > 0 && !u.some((h) => h === 'object' || h === 'array');
                }
                function y(h, f) {
                    let p = e.name('item'),
                        _ = (0, Ps.checkDataTypes)(u, p, i.opts.strictNumbers, Ps.DataType.Wrong),
                        R = e.const('indices', (0, L._)`{}`);
                    e.for((0, L._)`;${h}--;`, () => {
                        e.let(p, (0, L._)`${r}[${h}]`),
                            e.if(_, (0, L._)`continue`),
                            u.length > 1 && e.if((0, L._)`typeof ${p} == "string"`, (0, L._)`${p} += "_"`),
                            e
                                .if((0, L._)`typeof ${R}[${p}] == "number"`, () => {
                                    e.assign(f, (0, L._)`${R}[${p}]`), t.error(), e.assign(c, !1).break();
                                })
                                .code((0, L._)`${R}[${p}] = ${h}`);
                    });
                }
                function m(h, f) {
                    let p = (0, el.useFunc)(e, tl.default),
                        _ = e.name('outer');
                    e.label(_).for((0, L._)`;${h}--;`, () =>
                        e.for((0, L._)`${f} = ${h}; ${f}--;`, () =>
                            e.if((0, L._)`${p}(${r}[${h}], ${r}[${f}])`, () => {
                                t.error(), e.assign(c, !1).break(_);
                            }),
                        ),
                    );
                }
            },
        };
    Ns.default = sl;
});
var ma = g((Rs) => {
    'use strict';
    Object.defineProperty(Rs, '__esModule', { value: !0 });
    var Is = S(),
        nl = T(),
        ol = tr(),
        al = { message: 'must be equal to constant', params: ({ schemaCode: t }) => (0, Is._)`{allowedValue: ${t}}` },
        il = {
            keyword: 'const',
            $data: !0,
            error: al,
            code(t) {
                let { gen: e, data: r, $data: s, schemaCode: n, schema: o } = t;
                s || (o && typeof o == 'object')
                    ? t.fail$data((0, Is._)`!${(0, nl.useFunc)(e, ol.default)}(${r}, ${n})`)
                    : t.fail((0, Is._)`${o} !== ${r}`);
            },
        };
    Rs.default = il;
});
var ya = g((Os) => {
    'use strict';
    Object.defineProperty(Os, '__esModule', { value: !0 });
    var wt = S(),
        cl = T(),
        ul = tr(),
        dl = {
            message: 'must be equal to one of the allowed values',
            params: ({ schemaCode: t }) => (0, wt._)`{allowedValues: ${t}}`,
        },
        ll = {
            keyword: 'enum',
            schemaType: 'array',
            $data: !0,
            error: dl,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, schemaCode: o, it: a } = t;
                if (!s && n.length === 0) throw new Error('enum must have non-empty array');
                let i = n.length >= a.opts.loopEnum,
                    c,
                    u = () => c ?? (c = (0, cl.useFunc)(e, ul.default)),
                    d;
                if (i || s) (d = e.let('valid')), t.block$data(d, l);
                else {
                    if (!Array.isArray(n)) throw new Error('ajv implementation error');
                    let m = e.const('vSchema', o);
                    d = (0, wt.or)(...n.map((h, f) => y(m, f)));
                }
                t.pass(d);
                function l() {
                    e.assign(d, !1),
                        e.forOf('v', o, (m) => e.if((0, wt._)`${u()}(${r}, ${m})`, () => e.assign(d, !0).break()));
                }
                function y(m, h) {
                    let f = n[h];
                    return typeof f == 'object' && f !== null
                        ? (0, wt._)`${u()}(${r}, ${m}[${h}])`
                        : (0, wt._)`${r} === ${f}`;
                }
            },
        };
    Os.default = ll;
});
var ga = g((ks) => {
    'use strict';
    Object.defineProperty(ks, '__esModule', { value: !0 });
    var fl = na(),
        hl = oa(),
        pl = ca(),
        ml = ua(),
        yl = da(),
        gl = la(),
        _l = fa(),
        vl = pa(),
        $l = ma(),
        wl = ya(),
        El = [
            fl.default,
            hl.default,
            pl.default,
            ml.default,
            yl.default,
            gl.default,
            _l.default,
            vl.default,
            { keyword: 'type', schemaType: ['string', 'array'] },
            { keyword: 'nullable', schemaType: 'boolean' },
            $l.default,
            wl.default,
        ];
    ks.default = El;
});
var qs = g((Et) => {
    'use strict';
    Object.defineProperty(Et, '__esModule', { value: !0 });
    Et.validateAdditionalItems = void 0;
    var je = S(),
        Ts = T(),
        bl = {
            message: ({ params: { len: t } }) => (0, je.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, je._)`{limit: ${t}}`,
        },
        Sl = {
            keyword: 'additionalItems',
            type: 'array',
            schemaType: ['boolean', 'object'],
            before: 'uniqueItems',
            error: bl,
            code(t) {
                let { parentSchema: e, it: r } = t,
                    { items: s } = e;
                if (!Array.isArray(s)) {
                    (0, Ts.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return;
                }
                _a(t, s);
            },
        };
    function _a(t, e) {
        let { gen: r, schema: s, data: n, keyword: o, it: a } = t;
        a.items = !0;
        let i = r.const('len', (0, je._)`${n}.length`);
        if (s === !1) t.setParams({ len: e.length }), t.pass((0, je._)`${i} <= ${e.length}`);
        else if (typeof s == 'object' && !(0, Ts.alwaysValidSchema)(a, s)) {
            let u = r.var('valid', (0, je._)`${i} <= ${e.length}`);
            r.if((0, je.not)(u), () => c(u)), t.ok(u);
        }
        function c(u) {
            r.forRange('i', e.length, i, (d) => {
                t.subschema({ keyword: o, dataProp: d, dataPropType: Ts.Type.Num }, u),
                    a.allErrors || r.if((0, je.not)(u), () => r.break());
            });
        }
    }
    Et.validateAdditionalItems = _a;
    Et.default = Sl;
});
var As = g((bt) => {
    'use strict';
    Object.defineProperty(bt, '__esModule', { value: !0 });
    bt.validateTuple = void 0;
    var va = S(),
        rr = T(),
        Pl = Y(),
        Nl = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'array', 'boolean'],
            before: 'uniqueItems',
            code(t) {
                let { schema: e, it: r } = t;
                if (Array.isArray(e)) return $a(t, 'additionalItems', e);
                (r.items = !0), !(0, rr.alwaysValidSchema)(r, e) && t.ok((0, Pl.validateArray)(t));
            },
        };
    function $a(t, e, r = t.schema) {
        let { gen: s, parentSchema: n, data: o, keyword: a, it: i } = t;
        d(n),
            i.opts.unevaluated &&
                r.length &&
                i.items !== !0 &&
                (i.items = rr.mergeEvaluated.items(s, r.length, i.items));
        let c = s.name('valid'),
            u = s.const('len', (0, va._)`${o}.length`);
        r.forEach((l, y) => {
            (0, rr.alwaysValidSchema)(i, l) ||
                (s.if((0, va._)`${u} > ${y}`, () => t.subschema({ keyword: a, schemaProp: y, dataProp: y }, c)),
                t.ok(c));
        });
        function d(l) {
            let { opts: y, errSchemaPath: m } = i,
                h = r.length,
                f = h === l.minItems && (h === l.maxItems || l[e] === !1);
            if (y.strictTuples && !f) {
                let p = `"${a}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${m}"`;
                (0, rr.checkStrictMode)(i, p, y.strictTuples);
            }
        }
    }
    bt.validateTuple = $a;
    bt.default = Nl;
});
var wa = g((Cs) => {
    'use strict';
    Object.defineProperty(Cs, '__esModule', { value: !0 });
    var Il = As(),
        Rl = {
            keyword: 'prefixItems',
            type: 'array',
            schemaType: ['array'],
            before: 'uniqueItems',
            code: (t) => (0, Il.validateTuple)(t, 'items'),
        };
    Cs.default = Rl;
});
var ba = g((js) => {
    'use strict';
    Object.defineProperty(js, '__esModule', { value: !0 });
    var Ea = S(),
        Ol = T(),
        kl = Y(),
        Tl = qs(),
        ql = {
            message: ({ params: { len: t } }) => (0, Ea.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, Ea._)`{limit: ${t}}`,
        },
        Al = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            error: ql,
            code(t) {
                let { schema: e, parentSchema: r, it: s } = t,
                    { prefixItems: n } = r;
                (s.items = !0),
                    !(0, Ol.alwaysValidSchema)(s, e) &&
                        (n ? (0, Tl.validateAdditionalItems)(t, n) : t.ok((0, kl.validateArray)(t)));
            },
        };
    js.default = Al;
});
var Sa = g((Ms) => {
    'use strict';
    Object.defineProperty(Ms, '__esModule', { value: !0 });
    var ee = S(),
        sr = T(),
        Cl = {
            message: ({ params: { min: t, max: e } }) =>
                e === void 0
                    ? (0, ee.str)`must contain at least ${t} valid item(s)`
                    : (0, ee.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
            params: ({ params: { min: t, max: e } }) =>
                e === void 0 ? (0, ee._)`{minContains: ${t}}` : (0, ee._)`{minContains: ${t}, maxContains: ${e}}`,
        },
        jl = {
            keyword: 'contains',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            trackErrors: !0,
            error: Cl,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t,
                    a,
                    i,
                    { minContains: c, maxContains: u } = s;
                o.opts.next ? ((a = c === void 0 ? 1 : c), (i = u)) : (a = 1);
                let d = e.const('len', (0, ee._)`${n}.length`);
                if ((t.setParams({ min: a, max: i }), i === void 0 && a === 0)) {
                    (0, sr.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return;
                }
                if (i !== void 0 && a > i) {
                    (0, sr.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), t.fail();
                    return;
                }
                if ((0, sr.alwaysValidSchema)(o, r)) {
                    let f = (0, ee._)`${d} >= ${a}`;
                    i !== void 0 && (f = (0, ee._)`${f} && ${d} <= ${i}`), t.pass(f);
                    return;
                }
                o.items = !0;
                let l = e.name('valid');
                i === void 0 && a === 1
                    ? m(l, () => e.if(l, () => e.break()))
                    : a === 0
                      ? (e.let(l, !0), i !== void 0 && e.if((0, ee._)`${n}.length > 0`, y))
                      : (e.let(l, !1), y()),
                    t.result(l, () => t.reset());
                function y() {
                    let f = e.name('_valid'),
                        p = e.let('count', 0);
                    m(f, () => e.if(f, () => h(p)));
                }
                function m(f, p) {
                    e.forRange('i', 0, d, (_) => {
                        t.subschema(
                            { keyword: 'contains', dataProp: _, dataPropType: sr.Type.Num, compositeRule: !0 },
                            f,
                        ),
                            p();
                    });
                }
                function h(f) {
                    e.code((0, ee._)`${f}++`),
                        i === void 0
                            ? e.if((0, ee._)`${f} >= ${a}`, () => e.assign(l, !0).break())
                            : (e.if((0, ee._)`${f} > ${i}`, () => e.assign(l, !1).break()),
                              a === 1 ? e.assign(l, !0) : e.if((0, ee._)`${f} >= ${a}`, () => e.assign(l, !0)));
                }
            },
        };
    Ms.default = jl;
});
var Ia = g((de) => {
    'use strict';
    Object.defineProperty(de, '__esModule', { value: !0 });
    de.validateSchemaDeps = de.validatePropertyDeps = de.error = void 0;
    var Ds = S(),
        Ml = T(),
        St = Y();
    de.error = {
        message: ({ params: { property: t, depsCount: e, deps: r } }) => {
            let s = e === 1 ? 'property' : 'properties';
            return (0, Ds.str)`must have ${s} ${r} when property ${t} is present`;
        },
        params: ({ params: { property: t, depsCount: e, deps: r, missingProperty: s } }) => (0, Ds._)`{property: ${t},
    missingProperty: ${s},
    depsCount: ${e},
    deps: ${r}}`,
    };
    var Dl = {
        keyword: 'dependencies',
        type: 'object',
        schemaType: 'object',
        error: de.error,
        code(t) {
            let [e, r] = Ul(t);
            Pa(t, e), Na(t, r);
        },
    };
    function Ul({ schema: t }) {
        let e = {},
            r = {};
        for (let s in t) {
            if (s === '__proto__') continue;
            let n = Array.isArray(t[s]) ? e : r;
            n[s] = t[s];
        }
        return [e, r];
    }
    function Pa(t, e = t.schema) {
        let { gen: r, data: s, it: n } = t;
        if (Object.keys(e).length === 0) return;
        let o = r.let('missing');
        for (let a in e) {
            let i = e[a];
            if (i.length === 0) continue;
            let c = (0, St.propertyInData)(r, s, a, n.opts.ownProperties);
            t.setParams({ property: a, depsCount: i.length, deps: i.join(', ') }),
                n.allErrors
                    ? r.if(c, () => {
                          for (let u of i) (0, St.checkReportMissingProp)(t, u);
                      })
                    : (r.if((0, Ds._)`${c} && (${(0, St.checkMissingProp)(t, i, o)})`),
                      (0, St.reportMissingProp)(t, o),
                      r.else());
        }
    }
    de.validatePropertyDeps = Pa;
    function Na(t, e = t.schema) {
        let { gen: r, data: s, keyword: n, it: o } = t,
            a = r.name('valid');
        for (let i in e)
            (0, Ml.alwaysValidSchema)(o, e[i]) ||
                (r.if(
                    (0, St.propertyInData)(r, s, i, o.opts.ownProperties),
                    () => {
                        let c = t.subschema({ keyword: n, schemaProp: i }, a);
                        t.mergeValidEvaluated(c, a);
                    },
                    () => r.var(a, !0),
                ),
                t.ok(a));
    }
    de.validateSchemaDeps = Na;
    de.default = Dl;
});
var Oa = g((Us) => {
    'use strict';
    Object.defineProperty(Us, '__esModule', { value: !0 });
    var Ra = S(),
        Vl = T(),
        xl = {
            message: 'property name must be valid',
            params: ({ params: t }) => (0, Ra._)`{propertyName: ${t.propertyName}}`,
        },
        Ll = {
            keyword: 'propertyNames',
            type: 'object',
            schemaType: ['object', 'boolean'],
            error: xl,
            code(t) {
                let { gen: e, schema: r, data: s, it: n } = t;
                if ((0, Vl.alwaysValidSchema)(n, r)) return;
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
                        e.if((0, Ra.not)(o), () => {
                            t.error(!0), n.allErrors || e.break();
                        });
                }),
                    t.ok(o);
            },
        };
    Us.default = Ll;
});
var xs = g((Vs) => {
    'use strict';
    Object.defineProperty(Vs, '__esModule', { value: !0 });
    var nr = Y(),
        ne = S(),
        zl = me(),
        or = T(),
        Fl = {
            message: 'must NOT have additional properties',
            params: ({ params: t }) => (0, ne._)`{additionalProperty: ${t.additionalProperty}}`,
        },
        Kl = {
            keyword: 'additionalProperties',
            type: ['object'],
            schemaType: ['boolean', 'object'],
            allowUndefined: !0,
            trackErrors: !0,
            error: Fl,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, errsCount: o, it: a } = t;
                if (!o) throw new Error('ajv implementation error');
                let { allErrors: i, opts: c } = a;
                if (((a.props = !0), c.removeAdditional !== 'all' && (0, or.alwaysValidSchema)(a, r))) return;
                let u = (0, nr.allSchemaProperties)(s.properties),
                    d = (0, nr.allSchemaProperties)(s.patternProperties);
                l(), t.ok((0, ne._)`${o} === ${zl.default.errors}`);
                function l() {
                    e.forIn('key', n, (p) => {
                        !u.length && !d.length ? h(p) : e.if(y(p), () => h(p));
                    });
                }
                function y(p) {
                    let _;
                    if (u.length > 8) {
                        let R = (0, or.schemaRefOrVal)(a, s.properties, 'properties');
                        _ = (0, nr.isOwnProperty)(e, R, p);
                    } else u.length ? (_ = (0, ne.or)(...u.map((R) => (0, ne._)`${p} === ${R}`))) : (_ = ne.nil);
                    return (
                        d.length &&
                            (_ = (0, ne.or)(_, ...d.map((R) => (0, ne._)`${(0, nr.usePattern)(t, R)}.test(${p})`))),
                        (0, ne.not)(_)
                    );
                }
                function m(p) {
                    e.code((0, ne._)`delete ${n}[${p}]`);
                }
                function h(p) {
                    if (c.removeAdditional === 'all' || (c.removeAdditional && r === !1)) {
                        m(p);
                        return;
                    }
                    if (r === !1) {
                        t.setParams({ additionalProperty: p }), t.error(), i || e.break();
                        return;
                    }
                    if (typeof r == 'object' && !(0, or.alwaysValidSchema)(a, r)) {
                        let _ = e.name('valid');
                        c.removeAdditional === 'failing'
                            ? (f(p, _, !1),
                              e.if((0, ne.not)(_), () => {
                                  t.reset(), m(p);
                              }))
                            : (f(p, _), i || e.if((0, ne.not)(_), () => e.break()));
                    }
                }
                function f(p, _, R) {
                    let N = { keyword: 'additionalProperties', dataProp: p, dataPropType: or.Type.Str };
                    R === !1 && Object.assign(N, { compositeRule: !0, createErrors: !1, allErrors: !1 }),
                        t.subschema(N, _);
                }
            },
        };
    Vs.default = Kl;
});
var qa = g((zs) => {
    'use strict';
    Object.defineProperty(zs, '__esModule', { value: !0 });
    var Hl = dt(),
        ka = Y(),
        Ls = T(),
        Ta = xs(),
        Gl = {
            keyword: 'properties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t;
                o.opts.removeAdditional === 'all' &&
                    s.additionalProperties === void 0 &&
                    Ta.default.code(new Hl.KeywordCxt(o, Ta.default, 'additionalProperties'));
                let a = (0, ka.allSchemaProperties)(r);
                for (let l of a) o.definedProperties.add(l);
                o.opts.unevaluated &&
                    a.length &&
                    o.props !== !0 &&
                    (o.props = Ls.mergeEvaluated.props(e, (0, Ls.toHash)(a), o.props));
                let i = a.filter((l) => !(0, Ls.alwaysValidSchema)(o, r[l]));
                if (i.length === 0) return;
                let c = e.name('valid');
                for (let l of i)
                    u(l)
                        ? d(l)
                        : (e.if((0, ka.propertyInData)(e, n, l, o.opts.ownProperties)),
                          d(l),
                          o.allErrors || e.else().var(c, !0),
                          e.endIf()),
                        t.it.definedProperties.add(l),
                        t.ok(c);
                function u(l) {
                    return o.opts.useDefaults && !o.compositeRule && r[l].default !== void 0;
                }
                function d(l) {
                    t.subschema({ keyword: 'properties', schemaProp: l, dataProp: l }, c);
                }
            },
        };
    zs.default = Gl;
});
var Ma = g((Fs) => {
    'use strict';
    Object.defineProperty(Fs, '__esModule', { value: !0 });
    var Aa = Y(),
        ar = S(),
        Ca = T(),
        ja = T(),
        Jl = {
            keyword: 'patternProperties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, data: s, parentSchema: n, it: o } = t,
                    { opts: a } = o,
                    i = (0, Aa.allSchemaProperties)(r),
                    c = i.filter((f) => (0, Ca.alwaysValidSchema)(o, r[f]));
                if (i.length === 0 || (c.length === i.length && (!o.opts.unevaluated || o.props === !0))) return;
                let u = a.strictSchema && !a.allowMatchingProperties && n.properties,
                    d = e.name('valid');
                o.props !== !0 && !(o.props instanceof ar.Name) && (o.props = (0, ja.evaluatedPropsToName)(e, o.props));
                let { props: l } = o;
                y();
                function y() {
                    for (let f of i) u && m(f), o.allErrors ? h(f) : (e.var(d, !0), h(f), e.if(d));
                }
                function m(f) {
                    for (let p in u)
                        new RegExp(f).test(p) &&
                            (0, Ca.checkStrictMode)(
                                o,
                                `property ${p} matches pattern ${f} (use allowMatchingProperties)`,
                            );
                }
                function h(f) {
                    e.forIn('key', s, (p) => {
                        e.if((0, ar._)`${(0, Aa.usePattern)(t, f)}.test(${p})`, () => {
                            let _ = c.includes(f);
                            _ ||
                                t.subschema(
                                    {
                                        keyword: 'patternProperties',
                                        schemaProp: f,
                                        dataProp: p,
                                        dataPropType: ja.Type.Str,
                                    },
                                    d,
                                ),
                                o.opts.unevaluated && l !== !0
                                    ? e.assign((0, ar._)`${l}[${p}]`, !0)
                                    : !_ && !o.allErrors && e.if((0, ar.not)(d), () => e.break());
                        });
                    });
                }
            },
        };
    Fs.default = Jl;
});
var Da = g((Ks) => {
    'use strict';
    Object.defineProperty(Ks, '__esModule', { value: !0 });
    var Wl = T(),
        Bl = {
            keyword: 'not',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if ((0, Wl.alwaysValidSchema)(s, r)) {
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
    Ks.default = Bl;
});
var Ua = g((Hs) => {
    'use strict';
    Object.defineProperty(Hs, '__esModule', { value: !0 });
    var Ql = Y(),
        Xl = {
            keyword: 'anyOf',
            schemaType: 'array',
            trackErrors: !0,
            code: Ql.validateUnion,
            error: { message: 'must match a schema in anyOf' },
        };
    Hs.default = Xl;
});
var Va = g((Gs) => {
    'use strict';
    Object.defineProperty(Gs, '__esModule', { value: !0 });
    var ir = S(),
        Yl = T(),
        Zl = {
            message: 'must match exactly one schema in oneOf',
            params: ({ params: t }) => (0, ir._)`{passingSchemas: ${t.passing}}`,
        },
        ef = {
            keyword: 'oneOf',
            schemaType: 'array',
            trackErrors: !0,
            error: Zl,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, it: n } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                if (n.opts.discriminator && s.discriminator) return;
                let o = r,
                    a = e.let('valid', !1),
                    i = e.let('passing', null),
                    c = e.name('_valid');
                t.setParams({ passing: i }),
                    e.block(u),
                    t.result(
                        a,
                        () => t.reset(),
                        () => t.error(!0),
                    );
                function u() {
                    o.forEach((d, l) => {
                        let y;
                        (0, Yl.alwaysValidSchema)(n, d)
                            ? e.var(c, !0)
                            : (y = t.subschema({ keyword: 'oneOf', schemaProp: l, compositeRule: !0 }, c)),
                            l > 0 &&
                                e
                                    .if((0, ir._)`${c} && ${a}`)
                                    .assign(a, !1)
                                    .assign(i, (0, ir._)`[${i}, ${l}]`)
                                    .else(),
                            e.if(c, () => {
                                e.assign(a, !0), e.assign(i, l), y && t.mergeEvaluated(y, ir.Name);
                            });
                    });
                }
            },
        };
    Gs.default = ef;
});
var xa = g((Js) => {
    'use strict';
    Object.defineProperty(Js, '__esModule', { value: !0 });
    var tf = T(),
        rf = {
            keyword: 'allOf',
            schemaType: 'array',
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                let n = e.name('valid');
                r.forEach((o, a) => {
                    if ((0, tf.alwaysValidSchema)(s, o)) return;
                    let i = t.subschema({ keyword: 'allOf', schemaProp: a }, n);
                    t.ok(n), t.mergeEvaluated(i);
                });
            },
        };
    Js.default = rf;
});
var Fa = g((Ws) => {
    'use strict';
    Object.defineProperty(Ws, '__esModule', { value: !0 });
    var cr = S(),
        za = T(),
        sf = {
            message: ({ params: t }) => (0, cr.str)`must match "${t.ifClause}" schema`,
            params: ({ params: t }) => (0, cr._)`{failingKeyword: ${t.ifClause}}`,
        },
        nf = {
            keyword: 'if',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            error: sf,
            code(t) {
                let { gen: e, parentSchema: r, it: s } = t;
                r.then === void 0 &&
                    r.else === void 0 &&
                    (0, za.checkStrictMode)(s, '"if" without "then" and "else" is ignored');
                let n = La(s, 'then'),
                    o = La(s, 'else');
                if (!n && !o) return;
                let a = e.let('valid', !0),
                    i = e.name('_valid');
                if ((c(), t.reset(), n && o)) {
                    let d = e.let('ifClause');
                    t.setParams({ ifClause: d }), e.if(i, u('then', d), u('else', d));
                } else n ? e.if(i, u('then')) : e.if((0, cr.not)(i), u('else'));
                t.pass(a, () => t.error(!0));
                function c() {
                    let d = t.subschema({ keyword: 'if', compositeRule: !0, createErrors: !1, allErrors: !1 }, i);
                    t.mergeEvaluated(d);
                }
                function u(d, l) {
                    return () => {
                        let y = t.subschema({ keyword: d }, i);
                        e.assign(a, i),
                            t.mergeValidEvaluated(y, a),
                            l ? e.assign(l, (0, cr._)`${d}`) : t.setParams({ ifClause: d });
                    };
                }
            },
        };
    function La(t, e) {
        let r = t.schema[e];
        return r !== void 0 && !(0, za.alwaysValidSchema)(t, r);
    }
    Ws.default = nf;
});
var Ka = g((Bs) => {
    'use strict';
    Object.defineProperty(Bs, '__esModule', { value: !0 });
    var of = T(),
        af = {
            keyword: ['then', 'else'],
            schemaType: ['object', 'boolean'],
            code({ keyword: t, parentSchema: e, it: r }) {
                e.if === void 0 && (0, of.checkStrictMode)(r, `"${t}" without "if" is ignored`);
            },
        };
    Bs.default = af;
});
var Ha = g((Qs) => {
    'use strict';
    Object.defineProperty(Qs, '__esModule', { value: !0 });
    var cf = qs(),
        uf = wa(),
        df = As(),
        lf = ba(),
        ff = Sa(),
        hf = Ia(),
        pf = Oa(),
        mf = xs(),
        yf = qa(),
        gf = Ma(),
        _f = Da(),
        vf = Ua(),
        $f = Va(),
        wf = xa(),
        Ef = Fa(),
        bf = Ka();
    function Sf(t = !1) {
        let e = [
            _f.default,
            vf.default,
            $f.default,
            wf.default,
            Ef.default,
            bf.default,
            pf.default,
            mf.default,
            hf.default,
            yf.default,
            gf.default,
        ];
        return t ? e.push(uf.default, lf.default) : e.push(cf.default, df.default), e.push(ff.default), e;
    }
    Qs.default = Sf;
});
var Ga = g((Xs) => {
    'use strict';
    Object.defineProperty(Xs, '__esModule', { value: !0 });
    var D = S(),
        Pf = {
            message: ({ schemaCode: t }) => (0, D.str)`must match format "${t}"`,
            params: ({ schemaCode: t }) => (0, D._)`{format: ${t}}`,
        },
        Nf = {
            keyword: 'format',
            type: ['number', 'string'],
            schemaType: 'string',
            $data: !0,
            error: Pf,
            code(t, e) {
                let { gen: r, data: s, $data: n, schema: o, schemaCode: a, it: i } = t,
                    { opts: c, errSchemaPath: u, schemaEnv: d, self: l } = i;
                if (!c.validateFormats) return;
                n ? y() : m();
                function y() {
                    let h = r.scopeValue('formats', { ref: l.formats, code: c.code.formats }),
                        f = r.const('fDef', (0, D._)`${h}[${a}]`),
                        p = r.let('fType'),
                        _ = r.let('format');
                    r.if(
                        (0, D._)`typeof ${f} == "object" && !(${f} instanceof RegExp)`,
                        () => r.assign(p, (0, D._)`${f}.type || "string"`).assign(_, (0, D._)`${f}.validate`),
                        () => r.assign(p, (0, D._)`"string"`).assign(_, f),
                    ),
                        t.fail$data((0, D.or)(R(), N()));
                    function R() {
                        return c.strictSchema === !1 ? D.nil : (0, D._)`${a} && !${_}`;
                    }
                    function N() {
                        let C = d.$async
                                ? (0, D._)`(${f}.async ? await ${_}(${s}) : ${_}(${s}))`
                                : (0, D._)`${_}(${s})`,
                            w = (0, D._)`(typeof ${_} == "function" ? ${C} : ${_}.test(${s}))`;
                        return (0, D._)`${_} && ${_} !== true && ${p} === ${e} && !${w}`;
                    }
                }
                function m() {
                    let h = l.formats[o];
                    if (!h) {
                        R();
                        return;
                    }
                    if (h === !0) return;
                    let [f, p, _] = N(h);
                    f === e && t.pass(C());
                    function R() {
                        if (c.strictSchema === !1) {
                            l.logger.warn(w());
                            return;
                        }
                        throw new Error(w());
                        function w() {
                            return `unknown format "${o}" ignored in schema at path "${u}"`;
                        }
                    }
                    function N(w) {
                        let oe =
                                w instanceof RegExp
                                    ? (0, D.regexpCode)(w)
                                    : c.code.formats
                                      ? (0, D._)`${c.code.formats}${(0, D.getProperty)(o)}`
                                      : void 0,
                            le = r.scopeValue('formats', { key: o, ref: w, code: oe });
                        return typeof w == 'object' && !(w instanceof RegExp)
                            ? [w.type || 'string', w.validate, (0, D._)`${le}.validate`]
                            : ['string', w, le];
                    }
                    function C() {
                        if (typeof h == 'object' && !(h instanceof RegExp) && h.async) {
                            if (!d.$async) throw new Error('async format in sync schema');
                            return (0, D._)`await ${_}(${s})`;
                        }
                        return typeof p == 'function' ? (0, D._)`${_}(${s})` : (0, D._)`${_}.test(${s})`;
                    }
                }
            },
        };
    Xs.default = Nf;
});
var Ja = g((Ys) => {
    'use strict';
    Object.defineProperty(Ys, '__esModule', { value: !0 });
    var If = Ga(),
        Rf = [If.default];
    Ys.default = Rf;
});
var Wa = g((Ge) => {
    'use strict';
    Object.defineProperty(Ge, '__esModule', { value: !0 });
    Ge.contentVocabulary = Ge.metadataVocabulary = void 0;
    Ge.metadataVocabulary = ['title', 'description', 'default', 'deprecated', 'readOnly', 'writeOnly', 'examples'];
    Ge.contentVocabulary = ['contentMediaType', 'contentEncoding', 'contentSchema'];
});
var Qa = g((Zs) => {
    'use strict';
    Object.defineProperty(Zs, '__esModule', { value: !0 });
    var Of = sa(),
        kf = ga(),
        Tf = Ha(),
        qf = Ja(),
        Ba = Wa(),
        Af = [Of.default, kf.default, (0, Tf.default)(), qf.default, Ba.metadataVocabulary, Ba.contentVocabulary];
    Zs.default = Af;
});
var Ya = g((ur) => {
    'use strict';
    Object.defineProperty(ur, '__esModule', { value: !0 });
    ur.DiscrError = void 0;
    var Xa;
    (function (t) {
        (t.Tag = 'tag'), (t.Mapping = 'mapping');
    })(Xa || (ur.DiscrError = Xa = {}));
});
var ei = g((tn) => {
    'use strict';
    Object.defineProperty(tn, '__esModule', { value: !0 });
    var Je = S(),
        en = Ya(),
        Za = Ht(),
        Cf = lt(),
        jf = T(),
        Mf = {
            message: ({ params: { discrError: t, tagName: e } }) =>
                t === en.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
            params: ({ params: { discrError: t, tag: e, tagName: r } }) =>
                (0, Je._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`,
        },
        Df = {
            keyword: 'discriminator',
            type: 'object',
            schemaType: 'object',
            error: Mf,
            code(t) {
                let { gen: e, data: r, schema: s, parentSchema: n, it: o } = t,
                    { oneOf: a } = n;
                if (!o.opts.discriminator) throw new Error('discriminator: requires discriminator option');
                let i = s.propertyName;
                if (typeof i != 'string') throw new Error('discriminator: requires propertyName');
                if (s.mapping) throw new Error('discriminator: mapping is not supported');
                if (!a) throw new Error('discriminator: requires oneOf keyword');
                let c = e.let('valid', !1),
                    u = e.const('tag', (0, Je._)`${r}${(0, Je.getProperty)(i)}`);
                e.if(
                    (0, Je._)`typeof ${u} == "string"`,
                    () => d(),
                    () => t.error(!1, { discrError: en.DiscrError.Tag, tag: u, tagName: i }),
                ),
                    t.ok(c);
                function d() {
                    let m = y();
                    e.if(!1);
                    for (let h in m) e.elseIf((0, Je._)`${u} === ${h}`), e.assign(c, l(m[h]));
                    e.else(), t.error(!1, { discrError: en.DiscrError.Mapping, tag: u, tagName: i }), e.endIf();
                }
                function l(m) {
                    let h = e.name('valid'),
                        f = t.subschema({ keyword: 'oneOf', schemaProp: m }, h);
                    return t.mergeEvaluated(f, Je.Name), h;
                }
                function y() {
                    var m;
                    let h = {},
                        f = _(n),
                        p = !0;
                    for (let C = 0; C < a.length; C++) {
                        let w = a[C];
                        if (w?.$ref && !(0, jf.schemaHasRulesButRef)(w, o.self.RULES)) {
                            let le = w.$ref;
                            if (
                                ((w = Za.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, le)),
                                w instanceof Za.SchemaEnv && (w = w.schema),
                                w === void 0)
                            )
                                throw new Cf.default(o.opts.uriResolver, o.baseId, le);
                        }
                        let oe = (m = w?.properties) === null || m === void 0 ? void 0 : m[i];
                        if (typeof oe != 'object')
                            throw new Error(
                                `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`,
                            );
                        (p = p && (f || _(w))), R(oe, C);
                    }
                    if (!p) throw new Error(`discriminator: "${i}" must be required`);
                    return h;
                    function _({ required: C }) {
                        return Array.isArray(C) && C.includes(i);
                    }
                    function R(C, w) {
                        if (C.const) N(C.const, w);
                        else if (C.enum) for (let oe of C.enum) N(oe, w);
                        else throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
                    }
                    function N(C, w) {
                        if (typeof C != 'string' || C in h)
                            throw new Error(`discriminator: "${i}" values must be unique strings`);
                        h[C] = w;
                    }
                }
            },
        };
    tn.default = Df;
});
var ti = g((am, Uf) => {
    Uf.exports = {
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
var si = g((M, rn) => {
    'use strict';
    Object.defineProperty(M, '__esModule', { value: !0 });
    M.MissingRefError =
        M.ValidationError =
        M.CodeGen =
        M.Name =
        M.nil =
        M.stringify =
        M.str =
        M._ =
        M.KeywordCxt =
        M.Ajv =
            void 0;
    var Vf = Xo(),
        xf = Qa(),
        Lf = ei(),
        ri = ti(),
        zf = ['/properties'],
        dr = 'http://json-schema.org/draft-07/schema',
        We = class extends Vf.default {
            _addVocabularies() {
                super._addVocabularies(),
                    xf.default.forEach((e) => this.addVocabulary(e)),
                    this.opts.discriminator && this.addKeyword(Lf.default);
            }
            _addDefaultMetaSchema() {
                if ((super._addDefaultMetaSchema(), !this.opts.meta)) return;
                let e = this.opts.$data ? this.$dataMetaSchema(ri, zf) : ri;
                this.addMetaSchema(e, dr, !1), (this.refs['http://json-schema.org/schema'] = dr);
            }
            defaultMeta() {
                return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(dr) ? dr : void 0));
            }
        };
    M.Ajv = We;
    rn.exports = M = We;
    rn.exports.Ajv = We;
    Object.defineProperty(M, '__esModule', { value: !0 });
    M.default = We;
    var Ff = dt();
    Object.defineProperty(M, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return Ff.KeywordCxt;
        },
    });
    var Be = S();
    Object.defineProperty(M, '_', {
        enumerable: !0,
        get: function () {
            return Be._;
        },
    });
    Object.defineProperty(M, 'str', {
        enumerable: !0,
        get: function () {
            return Be.str;
        },
    });
    Object.defineProperty(M, 'stringify', {
        enumerable: !0,
        get: function () {
            return Be.stringify;
        },
    });
    Object.defineProperty(M, 'nil', {
        enumerable: !0,
        get: function () {
            return Be.nil;
        },
    });
    Object.defineProperty(M, 'Name', {
        enumerable: !0,
        get: function () {
            return Be.Name;
        },
    });
    Object.defineProperty(M, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return Be.CodeGen;
        },
    });
    var Kf = Ft();
    Object.defineProperty(M, 'ValidationError', {
        enumerable: !0,
        get: function () {
            return Kf.default;
        },
    });
    var Hf = lt();
    Object.defineProperty(M, 'MissingRefError', {
        enumerable: !0,
        get: function () {
            return Hf.default;
        },
    });
});
var Wf = {};
pi(Wf, { handleHttp: () => Gf, handleInvoke: () => Jf, schema: () => ai });
module.exports = mi(Wf);
var fe = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': 'true',
};
var yi = (t) => Buffer.from(t, 'base64').toString('utf-8'),
    an = (t) => {
        let e = t.split('.');
        return JSON.parse(yi(e[1]));
    },
    Nt = (t, e) => {
        try {
            return JSON.parse(e);
        } catch {
            return t;
        }
    };
var Pe = (t) => ({ statusCode: 403, headers: fe, body: typeof t == 'string' ? t : JSON.stringify(t) }),
    cn = (t, e, r) => Pe(`User ${t} has no ${e} rights on node ${r}`),
    ae = (t) => ({ statusCode: 400, headers: fe, body: typeof t == 'string' ? t : JSON.stringify(t) }),
    un = (t) => ({ statusCode: 401, headers: fe, body: t ? JSON.stringify(t) : 'Unauthorized' }),
    dn = (t) => ({ statusCode: 404, headers: fe, body: t ? JSON.stringify(t) : 'Not Found' }),
    ln = (t) => ({ statusCode: 422, headers: fe, body: t ? JSON.stringify(t) : 'Unprocessable Entity' }),
    mr = (t) => (t.statusCode ? t : (console.error(t), { statusCode: 500, headers: fe, body: t.message }));
var rh = ae({
        name: 'InvalidEmailError',
        message: 'The email must be valid and must not contain upper case letters or spaces.',
    }),
    sh = ae({
        name: 'InvalidPasswordError',
        message: 'The password must contain at least 8 characters and at least 1 number.',
    }),
    nh = ae({
        name: 'InvalidSrpAError',
        message: 'The SRP A value must be a correctly calculated random hex hash based on big integers.',
    }),
    oh = ae({ name: 'InvalidRefreshTokenError', message: 'Refresh token is invalid.' }),
    ah = ae({ name: 'VerificationCodeMismatchError', message: 'The verification code does not match.' }),
    ih = Pe({
        name: 'VerificationCodeExpiredError',
        message:
            'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
    }),
    ch = dn({ name: 'UserNotFoundError', message: 'No user was found under the given email or user ID.' }),
    uh = Pe({ name: 'UserNotVerifiedError', message: 'The user must be verified with Register Verify operation.' }),
    fn = Pe({ name: 'UserExistsError', message: 'There is an existing user with the given email address.' }),
    dh = ae({
        name: 'UserMissingPasswordChallengeError',
        message: 'The user must have an active require password change challenge.',
    }),
    lh = Pe({ name: 'PasswordResetRequiredError', message: 'The password must be reset.' }),
    fh = ln({
        name: 'PasswordResetMissingParamError',
        message: 'Either a verification code or the users old password are required.',
    }),
    hh = Pe({
        name: 'LoginVerifyError',
        message:
            'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
    });
var It = process.env.AWS_REGION || '',
    hn = process.env.ADMIN_EMAILS || '',
    mh = process.env.CLOUDFRONT_ACCESS_KEY_ID || '',
    yh = process.env.CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER || '',
    pn = process.env.INVITE_USER_VALIDATION_VIEW || '',
    mn = process.env.PULL_LAMBDA_NAME || '',
    gh = process.env.MEDIA_DOMAIN || '',
    gi = process.env.CLIENT_ID || '',
    yr = process.env.USER_POOL_ID || '';
var _i = require('crypto');
var Rt = require('@aws-sdk/client-lambda');
var vi = new Rt.LambdaClient({ region: It, apiVersion: 'latest' }),
    yn = new TextDecoder(),
    gn = async (t, e) => {
        let r = new Rt.InvokeCommand({
            FunctionName: t,
            Payload: JSON.stringify({ body: e }),
            InvocationType: 'RequestResponse',
        });
        try {
            let s = await vi.send(r);
            return s.FunctionError
                ? Promise.reject(JSON.parse(yn.decode(s.Payload)))
                : JSON.parse(yn.decode(s.Payload));
        } catch (s) {
            console.error(s);
            return;
        }
    };
var U = require('@aws-sdk/client-cognito-identity-provider');
var _n = new U.CognitoIdentityProviderClient({ region: It, apiVersion: 'latest' });
var vn = async (t, e, r = 'default') => {
    let s = new U.AdminCreateUserCommand({
        UserPoolId: yr,
        Username: t,
        TemporaryPassword: e,
        ClientMetadata: { templateId: r },
    });
    return _n.send(s);
};
var $i = async (t) => {
    let e = new U.AdminGetUserCommand({ UserPoolId: yr, Username: t });
    return _n.send(e);
};
var $n = async (t) => {
    try {
        return await $i(t), !0;
    } catch {
        return !1;
    }
};
var V = [];
for (let t = 0; t < 256; ++t) V.push((t + 256).toString(16).slice(1));
function wn(t, e = 0) {
    return `${V[t[e + 0]] + V[t[e + 1]] + V[t[e + 2]] + V[t[e + 3]]}-${V[t[e + 4]]}${V[t[e + 5]]}-${V[t[e + 6]]}${V[t[e + 7]]}-${V[t[e + 8]]}${V[t[e + 9]]}-${V[t[e + 10]]}${V[t[e + 11]]}${V[t[e + 12]]}${V[t[e + 13]]}${V[t[e + 14]]}${V[t[e + 15]]}`.toLowerCase();
}
var En = pr(require('node:crypto')),
    kt = new Uint8Array(256),
    Ot = kt.length;
function gr() {
    return Ot > kt.length - 16 && (En.default.randomFillSync(kt), (Ot = 0)), kt.slice(Ot, (Ot += 16));
}
var bn = pr(require('node:crypto')),
    _r = { randomUUID: bn.default.randomUUID };
function wi(t, e, r) {
    if (_r.randomUUID && !e && !t) return _r.randomUUID();
    t = t || {};
    let s = t.random || (t.rng || gr)();
    if (((s[6] = (s[6] & 15) | 64), (s[8] = (s[8] & 63) | 128), e)) {
        r = r || 0;
        for (let n = 0; n < 16; ++n) e[r + n] = s[n];
        return e;
    }
    return wn(s);
}
var vr = wi;
var ni = pr(si(), 1);
var oi = async (t, e) => {
    let r;
    try {
        r = an(e.headers.Authorization || e.headers.authorization || '');
    } catch {
        throw un();
    }
    let s = null;
    try {
        let n = Nt(e.body || {}, e.body || ''),
            o = new ni.Ajv();
        if ((o.addKeyword('example'), o.validate(t, n))) {
            let i = r.email,
                c = e.headers['x-as-role'] || 'user',
                u = !!e.headers['x-as-admin'] && hn.includes(i);
            return { userEmail: i, body: n, asAdmin: u, asRole: c };
        } else s = ae(JSON.stringify(o.errors));
    } catch (n) {
        s = ae(n.message);
    }
    throw s;
};
var ai = {
        type: 'object',
        properties: {
            email: { type: 'string', description: 'Email of the user to be invited.' },
            id: {
                type: 'string',
                description: 'Id of the node the executing user wants to use for rights validation.',
            },
            templateId: {
                type: 'string',
                description:
                    'Identifier of the email template that will be used to send credentials to the invited user.',
            },
        },
        required: ['email', 'id'],
    },
    ii = async ({ userEmail: t, body: e, asAdmin: r }) => {
        let { email: s, id: n, templateId: o } = e;
        if (await $n(s)) return fn;
        let i = Nt({}, pn),
            u = await gn(mn, { userEmail: t, body: i, asAdmin: r });
        if (!(u?.body ? JSON.parse(u.body) : {})?.rights?.[n]?.user?.[t]?.admin) return cn(t || '', 'admin', n);
        let l = vr().replace(/-/g, '').slice(0, 16);
        return (
            await vn(s, l, o),
            { statusCode: 201, headers: fe, body: JSON.stringify({ message: `User ${s} was successfully invited.` }) }
        );
    },
    Gf = async (t) => {
        try {
            let e = await oi(ai, t);
            return await ii(e);
        } catch (e) {
            return mr(e);
        }
    },
    Jf = async ({ body: t }) => {
        try {
            return await ii(t);
        } catch (e) {
            return mr(e);
        }
    };
0 && (module.exports = { handleHttp, handleInvoke, schema });
