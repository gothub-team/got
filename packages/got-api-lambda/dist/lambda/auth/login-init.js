'use strict';
var Ja = Object.create;
var Pt = Object.defineProperty;
var Wa = Object.getOwnPropertyDescriptor;
var Ba = Object.getOwnPropertyNames;
var Qa = Object.getPrototypeOf,
    Xa = Object.prototype.hasOwnProperty;
var g = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    Ya = (t, e) => {
        for (var r in e) Pt(t, r, { get: e[r], enumerable: !0 });
    },
    Ws = (t, e, r, s) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
            for (let n of Ba(e))
                !Xa.call(t, n) && n !== r && Pt(t, n, { get: () => e[n], enumerable: !(s = Wa(e, n)) || s.enumerable });
        return t;
    };
var Za = (t, e, r) => (
        (r = t != null ? Ja(Qa(t)) : {}),
        Ws(e || !t || !t.__esModule ? Pt(r, 'default', { value: t, enumerable: !0 }) : r, t)
    ),
    ei = (t) => Ws(Pt({}, '__esModule', { value: !0 }), t);
var Ye = g((k) => {
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
    var Qe = class {};
    k._CodeOrName = Qe;
    k.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Pe = class extends Qe {
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
    k.Name = Pe;
    var Q = class extends Qe {
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
                      (r, s) => (s instanceof Pe && (r[s.str] = (r[s.str] || 0) + 1), r),
                      {},
                  ));
        }
    };
    k._Code = Q;
    k.nil = new Q('');
    function un(t, ...e) {
        let r = [t[0]],
            s = 0;
        for (; s < e.length; ) lr(r, e[s]), r.push(t[++s]);
        return new Q(r);
    }
    k._ = un;
    var ur = new Q('+');
    function ln(t, ...e) {
        let r = [Xe(t[0])],
            s = 0;
        for (; s < e.length; ) r.push(ur), lr(r, e[s]), r.push(ur, Xe(t[++s]));
        return oi(r), new Q(r);
    }
    k.str = ln;
    function lr(t, e) {
        e instanceof Q ? t.push(...e._items) : e instanceof Pe ? t.push(e) : t.push(ci(e));
    }
    k.addCodeArg = lr;
    function oi(t) {
        let e = 1;
        for (; e < t.length - 1; ) {
            if (t[e] === ur) {
                let r = ai(t[e - 1], t[e + 1]);
                if (r !== void 0) {
                    t.splice(e - 1, 3, r);
                    continue;
                }
                t[e++] = '+';
            }
            e++;
        }
    }
    function ai(t, e) {
        if (e === '""') return t;
        if (t === '""') return e;
        if (typeof t == 'string')
            return e instanceof Pe || t[t.length - 1] !== '"'
                ? void 0
                : typeof e != 'string'
                  ? `${t.slice(0, -1)}${e}"`
                  : e[0] === '"'
                    ? t.slice(0, -1) + e.slice(1)
                    : void 0;
        if (typeof e == 'string' && e[0] === '"' && !(t instanceof Pe)) return `"${t}${e.slice(1)}`;
    }
    function ii(t, e) {
        return e.emptyStr() ? t : t.emptyStr() ? e : ln`${t}${e}`;
    }
    k.strConcat = ii;
    function ci(t) {
        return typeof t == 'number' || typeof t == 'boolean' || t === null ? t : Xe(Array.isArray(t) ? t.join(',') : t);
    }
    function ui(t) {
        return new Q(Xe(t));
    }
    k.stringify = ui;
    function Xe(t) {
        return JSON.stringify(t)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
    }
    k.safeStringify = Xe;
    function li(t) {
        return typeof t == 'string' && k.IDENTIFIER.test(t) ? new Q(`.${t}`) : un`[${t}]`;
    }
    k.getProperty = li;
    function di(t) {
        if (typeof t == 'string' && k.IDENTIFIER.test(t)) return new Q(`${t}`);
        throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`);
    }
    k.getEsmExportName = di;
    function fi(t) {
        return new Q(t.toString());
    }
    k.regexpCode = fi;
});
var hr = g((J) => {
    'use strict';
    Object.defineProperty(J, '__esModule', { value: !0 });
    J.ValueScope = J.ValueScopeName = J.Scope = J.varKinds = J.UsedValueState = void 0;
    var G = Ye(),
        dr = class extends Error {
            constructor(e) {
                super(`CodeGen: "code" for ${e} not defined`), (this.value = e.value);
            }
        },
        St;
    (function (t) {
        (t[(t.Started = 0)] = 'Started'), (t[(t.Completed = 1)] = 'Completed');
    })(St || (J.UsedValueState = St = {}));
    J.varKinds = { const: new G.Name('const'), let: new G.Name('let'), var: new G.Name('var') };
    var Nt = class {
        constructor({ prefixes: e, parent: r } = {}) {
            (this._names = {}), (this._prefixes = e), (this._parent = r);
        }
        toName(e) {
            return e instanceof G.Name ? e : this.name(e);
        }
        name(e) {
            return new G.Name(this._newName(e));
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
    J.Scope = Nt;
    var Rt = class extends G.Name {
        constructor(e, r) {
            super(r), (this.prefix = e);
        }
        setValue(e, { property: r, itemIndex: s }) {
            (this.value = e), (this.scopePath = (0, G._)`.${new G.Name(r)}[${s}]`);
        }
    };
    J.ValueScopeName = Rt;
    var hi = (0, G._)`\n`,
        fr = class extends Nt {
            constructor(e) {
                super(e),
                    (this._values = {}),
                    (this._scope = e.scope),
                    (this.opts = { ...e, _n: e.lines ? hi : G.nil });
            }
            get() {
                return this._scope;
            }
            name(e) {
                return new Rt(e, this._newName(e));
            }
            value(e, r) {
                var s;
                if (r.ref === void 0) throw new Error('CodeGen: ref must be passed in value');
                let n = this.toName(e),
                    { prefix: o } = n,
                    a = (s = r.key) !== null && s !== void 0 ? s : r.ref,
                    i = this._values[o];
                if (i) {
                    let u = i.get(a);
                    if (u) return u;
                } else i = this._values[o] = new Map();
                i.set(a, n);
                let c = this._scope[o] || (this._scope[o] = []),
                    l = c.length;
                return (c[l] = r.ref), n.setValue(r, { property: o, itemIndex: l }), n;
            }
            getValue(e, r) {
                let s = this._values[e];
                if (s) return s.get(r);
            }
            scopeRefs(e, r = this._values) {
                return this._reduceValues(r, (s) => {
                    if (s.scopePath === void 0) throw new Error(`CodeGen: name "${s}" has no value`);
                    return (0, G._)`${e}${s.scopePath}`;
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
                let o = G.nil;
                for (let a in e) {
                    let i = e[a];
                    if (!i) continue;
                    let c = (s[a] = s[a] || new Map());
                    i.forEach((l) => {
                        if (c.has(l)) return;
                        c.set(l, St.Started);
                        let u = r(l);
                        if (u) {
                            let d = this.opts.es5 ? J.varKinds.var : J.varKinds.const;
                            o = (0, G._)`${o}${d} ${l} = ${u};${this.opts._n}`;
                        } else if ((u = n?.(l))) o = (0, G._)`${o}${u}${this.opts._n}`;
                        else throw new dr(l);
                        c.set(l, St.Completed);
                    });
                }
                return o;
            }
        };
    J.ValueScope = fr;
});
var P = g((b) => {
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
    var R = Ye(),
        ee = hr(),
        ge = Ye();
    Object.defineProperty(b, '_', {
        enumerable: !0,
        get: function () {
            return ge._;
        },
    });
    Object.defineProperty(b, 'str', {
        enumerable: !0,
        get: function () {
            return ge.str;
        },
    });
    Object.defineProperty(b, 'strConcat', {
        enumerable: !0,
        get: function () {
            return ge.strConcat;
        },
    });
    Object.defineProperty(b, 'nil', {
        enumerable: !0,
        get: function () {
            return ge.nil;
        },
    });
    Object.defineProperty(b, 'getProperty', {
        enumerable: !0,
        get: function () {
            return ge.getProperty;
        },
    });
    Object.defineProperty(b, 'stringify', {
        enumerable: !0,
        get: function () {
            return ge.stringify;
        },
    });
    Object.defineProperty(b, 'regexpCode', {
        enumerable: !0,
        get: function () {
            return ge.regexpCode;
        },
    });
    Object.defineProperty(b, 'Name', {
        enumerable: !0,
        get: function () {
            return ge.Name;
        },
    });
    var Tt = hr();
    Object.defineProperty(b, 'Scope', {
        enumerable: !0,
        get: function () {
            return Tt.Scope;
        },
    });
    Object.defineProperty(b, 'ValueScope', {
        enumerable: !0,
        get: function () {
            return Tt.ValueScope;
        },
    });
    Object.defineProperty(b, 'ValueScopeName', {
        enumerable: !0,
        get: function () {
            return Tt.ValueScopeName;
        },
    });
    Object.defineProperty(b, 'varKinds', {
        enumerable: !0,
        get: function () {
            return Tt.varKinds;
        },
    });
    b.operators = {
        GT: new R._Code('>'),
        GTE: new R._Code('>='),
        LT: new R._Code('<'),
        LTE: new R._Code('<='),
        EQ: new R._Code('==='),
        NEQ: new R._Code('!=='),
        NOT: new R._Code('!'),
        OR: new R._Code('||'),
        AND: new R._Code('&&'),
        ADD: new R._Code('+'),
    };
    var de = class {
            optimizeNodes() {
                return this;
            }
            optimizeNames(e, r) {
                return this;
            }
        },
        pr = class extends de {
            constructor(e, r, s) {
                super(), (this.varKind = e), (this.name = r), (this.rhs = s);
            }
            render({ es5: e, _n: r }) {
                let s = e ? ee.varKinds.var : this.varKind,
                    n = this.rhs === void 0 ? '' : ` = ${this.rhs}`;
                return `${s} ${this.name}${n};${r}`;
            }
            optimizeNames(e, r) {
                if (e[this.name.str]) return this.rhs && (this.rhs = Me(this.rhs, e, r)), this;
            }
            get names() {
                return this.rhs instanceof R._CodeOrName ? this.rhs.names : {};
            }
        },
        It = class extends de {
            constructor(e, r, s) {
                super(), (this.lhs = e), (this.rhs = r), (this.sideEffects = s);
            }
            render({ _n: e }) {
                return `${this.lhs} = ${this.rhs};${e}`;
            }
            optimizeNames(e, r) {
                if (!(this.lhs instanceof R.Name && !e[this.lhs.str] && !this.sideEffects))
                    return (this.rhs = Me(this.rhs, e, r)), this;
            }
            get names() {
                let e = this.lhs instanceof R.Name ? {} : { ...this.lhs.names };
                return kt(e, this.rhs);
            }
        },
        mr = class extends It {
            constructor(e, r, s, n) {
                super(e, s, n), (this.op = r);
            }
            render({ _n: e }) {
                return `${this.lhs} ${this.op}= ${this.rhs};${e}`;
            }
        },
        yr = class extends de {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `${this.label}:${e}`;
            }
        },
        gr = class extends de {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `break${this.label ? ` ${this.label}` : ''};${e}`;
            }
        },
        _r = class extends de {
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
        $r = class extends de {
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
                return (this.code = Me(this.code, e, r)), this;
            }
            get names() {
                return this.code instanceof R._CodeOrName ? this.code.names : {};
            }
        },
        Ze = class extends de {
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
                    o.optimizeNames(e, r) || (pi(e, o.names), s.splice(n, 1));
                }
                return s.length > 0 ? this : void 0;
            }
            get names() {
                return this.nodes.reduce((e, r) => Re(e, r.names), {});
            }
        },
        fe = class extends Ze {
            render(e) {
                return `{${e._n}${super.render(e)}}${e._n}`;
            }
        },
        vr = class extends Ze {},
        je = class extends fe {};
    je.kind = 'else';
    var Se = class t extends fe {
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
                r = this.else = Array.isArray(s) ? new je(s) : s;
            }
            if (r)
                return e === !1
                    ? r instanceof t
                        ? r
                        : r.nodes
                    : this.nodes.length
                      ? this
                      : new t(dn(e), r instanceof t ? [r] : r.nodes);
            if (!(e === !1 || !this.nodes.length)) return this;
        }
        optimizeNames(e, r) {
            var s;
            if (
                ((this.else = (s = this.else) === null || s === void 0 ? void 0 : s.optimizeNames(e, r)),
                !!(super.optimizeNames(e, r) || this.else))
            )
                return (this.condition = Me(this.condition, e, r)), this;
        }
        get names() {
            let e = super.names;
            return kt(e, this.condition), this.else && Re(e, this.else.names), e;
        }
    };
    Se.kind = 'if';
    var Ne = class extends fe {};
    Ne.kind = 'for';
    var wr = class extends Ne {
            constructor(e) {
                super(), (this.iteration = e);
            }
            render(e) {
                return `for(${this.iteration})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iteration = Me(this.iteration, e, r)), this;
            }
            get names() {
                return Re(super.names, this.iteration.names);
            }
        },
        Er = class extends Ne {
            constructor(e, r, s, n) {
                super(), (this.varKind = e), (this.name = r), (this.from = s), (this.to = n);
            }
            render(e) {
                let r = e.es5 ? ee.varKinds.var : this.varKind,
                    { name: s, from: n, to: o } = this;
                return `for(${r} ${s}=${n}; ${s}<${o}; ${s}++)${super.render(e)}`;
            }
            get names() {
                let e = kt(super.names, this.from);
                return kt(e, this.to);
            }
        },
        Ot = class extends Ne {
            constructor(e, r, s, n) {
                super(), (this.loop = e), (this.varKind = r), (this.name = s), (this.iterable = n);
            }
            render(e) {
                return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iterable = Me(this.iterable, e, r)), this;
            }
            get names() {
                return Re(super.names, this.iterable.names);
            }
        },
        et = class extends fe {
            constructor(e, r, s) {
                super(), (this.name = e), (this.args = r), (this.async = s);
            }
            render(e) {
                return `${this.async ? 'async ' : ''}function ${this.name}(${this.args})${super.render(e)}`;
            }
        };
    et.kind = 'func';
    var tt = class extends Ze {
        render(e) {
            return `return ${super.render(e)}`;
        }
    };
    tt.kind = 'return';
    var br = class extends fe {
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
                return this.catch && Re(e, this.catch.names), this.finally && Re(e, this.finally.names), e;
            }
        },
        rt = class extends fe {
            constructor(e) {
                super(), (this.error = e);
            }
            render(e) {
                return `catch(${this.error})${super.render(e)}`;
            }
        };
    rt.kind = 'catch';
    var st = class extends fe {
        render(e) {
            return `finally${super.render(e)}`;
        }
    };
    st.kind = 'finally';
    var Pr = class {
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
                (this._scope = new ee.Scope({ parent: e })),
                (this._nodes = [new vr()]);
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
            return s !== void 0 && n && (this._constants[o.str] = s), this._leafNode(new pr(e, o, s)), o;
        }
        const(e, r, s) {
            return this._def(ee.varKinds.const, e, r, s);
        }
        let(e, r, s) {
            return this._def(ee.varKinds.let, e, r, s);
        }
        var(e, r, s) {
            return this._def(ee.varKinds.var, e, r, s);
        }
        assign(e, r, s) {
            return this._leafNode(new It(e, r, s));
        }
        add(e, r) {
            return this._leafNode(new mr(e, b.operators.ADD, r));
        }
        code(e) {
            return typeof e == 'function' ? e() : e !== R.nil && this._leafNode(new $r(e)), this;
        }
        object(...e) {
            let r = ['{'];
            for (let [s, n] of e)
                r.length > 1 && r.push(','),
                    r.push(s),
                    (s !== n || this.opts.es5) && (r.push(':'), (0, R.addCodeArg)(r, n));
            return r.push('}'), new R._Code(r);
        }
        if(e, r, s) {
            if ((this._blockNode(new Se(e)), r && s)) this.code(r).else().code(s).endIf();
            else if (r) this.code(r).endIf();
            else if (s) throw new Error('CodeGen: "else" body without "then" body');
            return this;
        }
        elseIf(e) {
            return this._elseNode(new Se(e));
        }
        else() {
            return this._elseNode(new je());
        }
        endIf() {
            return this._endBlockNode(Se, je);
        }
        _for(e, r) {
            return this._blockNode(e), r && this.code(r).endFor(), this;
        }
        for(e, r) {
            return this._for(new wr(e), r);
        }
        forRange(e, r, s, n, o = this.opts.es5 ? ee.varKinds.var : ee.varKinds.let) {
            let a = this._scope.toName(e);
            return this._for(new Er(o, a, r, s), () => n(a));
        }
        forOf(e, r, s, n = ee.varKinds.const) {
            let o = this._scope.toName(e);
            if (this.opts.es5) {
                let a = r instanceof R.Name ? r : this.var('_arr', r);
                return this.forRange('_i', 0, (0, R._)`${a}.length`, (i) => {
                    this.var(o, (0, R._)`${a}[${i}]`), s(o);
                });
            }
            return this._for(new Ot('of', n, o, r), () => s(o));
        }
        forIn(e, r, s, n = this.opts.es5 ? ee.varKinds.var : ee.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(e, (0, R._)`Object.keys(${r})`, s);
            let o = this._scope.toName(e);
            return this._for(new Ot('in', n, o, r), () => s(o));
        }
        endFor() {
            return this._endBlockNode(Ne);
        }
        label(e) {
            return this._leafNode(new yr(e));
        }
        break(e) {
            return this._leafNode(new gr(e));
        }
        return(e) {
            let r = new tt();
            if ((this._blockNode(r), this.code(e), r.nodes.length !== 1))
                throw new Error('CodeGen: "return" should have one node');
            return this._endBlockNode(tt);
        }
        try(e, r, s) {
            if (!r && !s) throw new Error('CodeGen: "try" without "catch" and "finally"');
            let n = new br();
            if ((this._blockNode(n), this.code(e), r)) {
                let o = this.name('e');
                (this._currNode = n.catch = new rt(o)), r(o);
            }
            return s && ((this._currNode = n.finally = new st()), this.code(s)), this._endBlockNode(rt, st);
        }
        throw(e) {
            return this._leafNode(new _r(e));
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
        func(e, r = R.nil, s, n) {
            return this._blockNode(new et(e, r, s)), n && this.code(n).endFunc(), this;
        }
        endFunc() {
            return this._endBlockNode(et);
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
            if (!(r instanceof Se)) throw new Error('CodeGen: "else" without "if"');
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
    b.CodeGen = Pr;
    function Re(t, e) {
        for (let r in e) t[r] = (t[r] || 0) + (e[r] || 0);
        return t;
    }
    function kt(t, e) {
        return e instanceof R._CodeOrName ? Re(t, e.names) : t;
    }
    function Me(t, e, r) {
        if (t instanceof R.Name) return s(t);
        if (!n(t)) return t;
        return new R._Code(
            t._items.reduce(
                (o, a) => (
                    a instanceof R.Name && (a = s(a)), a instanceof R._Code ? o.push(...a._items) : o.push(a), o
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
                o instanceof R._Code &&
                o._items.some((a) => a instanceof R.Name && e[a.str] === 1 && r[a.str] !== void 0)
            );
        }
    }
    function pi(t, e) {
        for (let r in e) t[r] = (t[r] || 0) - (e[r] || 0);
    }
    function dn(t) {
        return typeof t == 'boolean' || typeof t == 'number' || t === null ? !t : (0, R._)`!${Sr(t)}`;
    }
    b.not = dn;
    var mi = fn(b.operators.AND);
    function yi(...t) {
        return t.reduce(mi);
    }
    b.and = yi;
    var gi = fn(b.operators.OR);
    function _i(...t) {
        return t.reduce(gi);
    }
    b.or = _i;
    function fn(t) {
        return (e, r) => (e === R.nil ? r : r === R.nil ? e : (0, R._)`${Sr(e)} ${t} ${Sr(r)}`);
    }
    function Sr(t) {
        return t instanceof R.Name ? t : (0, R._)`(${t})`;
    }
});
var T = g((S) => {
    'use strict';
    Object.defineProperty(S, '__esModule', { value: !0 });
    S.checkStrictMode =
        S.getErrorPath =
        S.Type =
        S.useFunc =
        S.setEvaluated =
        S.evaluatedPropsToName =
        S.mergeEvaluated =
        S.eachItem =
        S.unescapeJsonPointer =
        S.escapeJsonPointer =
        S.escapeFragment =
        S.unescapeFragment =
        S.schemaRefOrVal =
        S.schemaHasRulesButRef =
        S.schemaHasRules =
        S.checkUnknownRules =
        S.alwaysValidSchema =
        S.toHash =
            void 0;
    var C = P(),
        $i = Ye();
    function vi(t) {
        let e = {};
        for (let r of t) e[r] = !0;
        return e;
    }
    S.toHash = vi;
    function wi(t, e) {
        return typeof e == 'boolean' ? e : Object.keys(e).length === 0 ? !0 : (mn(t, e), !yn(e, t.self.RULES.all));
    }
    S.alwaysValidSchema = wi;
    function mn(t, e = t.schema) {
        let { opts: r, self: s } = t;
        if (!r.strictSchema || typeof e == 'boolean') return;
        let n = s.RULES.keywords;
        for (let o in e) n[o] || $n(t, `unknown keyword: "${o}"`);
    }
    S.checkUnknownRules = mn;
    function yn(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e[r]) return !0;
        return !1;
    }
    S.schemaHasRules = yn;
    function Ei(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (r !== '$ref' && e.all[r]) return !0;
        return !1;
    }
    S.schemaHasRulesButRef = Ei;
    function bi({ topSchemaRef: t, schemaPath: e }, r, s, n) {
        if (!n) {
            if (typeof r == 'number' || typeof r == 'boolean') return r;
            if (typeof r == 'string') return (0, C._)`${r}`;
        }
        return (0, C._)`${t}${e}${(0, C.getProperty)(s)}`;
    }
    S.schemaRefOrVal = bi;
    function Pi(t) {
        return gn(decodeURIComponent(t));
    }
    S.unescapeFragment = Pi;
    function Si(t) {
        return encodeURIComponent(Rr(t));
    }
    S.escapeFragment = Si;
    function Rr(t) {
        return typeof t == 'number' ? `${t}` : t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
    S.escapeJsonPointer = Rr;
    function gn(t) {
        return t.replace(/~1/g, '/').replace(/~0/g, '~');
    }
    S.unescapeJsonPointer = gn;
    function Ni(t, e) {
        if (Array.isArray(t)) for (let r of t) e(r);
        else e(t);
    }
    S.eachItem = Ni;
    function hn({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: s }) {
        return (n, o, a, i) => {
            let c =
                a === void 0
                    ? o
                    : a instanceof C.Name
                      ? (o instanceof C.Name ? t(n, o, a) : e(n, o, a), a)
                      : o instanceof C.Name
                        ? (e(n, a, o), o)
                        : r(o, a);
            return i === C.Name && !(c instanceof C.Name) ? s(n, c) : c;
        };
    }
    S.mergeEvaluated = {
        props: hn({
            mergeNames: (t, e, r) =>
                t.if((0, C._)`${r} !== true && ${e} !== undefined`, () => {
                    t.if(
                        (0, C._)`${e} === true`,
                        () => t.assign(r, !0),
                        () => t.assign(r, (0, C._)`${r} || {}`).code((0, C._)`Object.assign(${r}, ${e})`),
                    );
                }),
            mergeToName: (t, e, r) =>
                t.if((0, C._)`${r} !== true`, () => {
                    e === !0 ? t.assign(r, !0) : (t.assign(r, (0, C._)`${r} || {}`), Ir(t, r, e));
                }),
            mergeValues: (t, e) => (t === !0 ? !0 : { ...t, ...e }),
            resultToName: _n,
        }),
        items: hn({
            mergeNames: (t, e, r) =>
                t.if((0, C._)`${r} !== true && ${e} !== undefined`, () =>
                    t.assign(r, (0, C._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`),
                ),
            mergeToName: (t, e, r) =>
                t.if((0, C._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, C._)`${r} > ${e} ? ${r} : ${e}`)),
            mergeValues: (t, e) => (t === !0 ? !0 : Math.max(t, e)),
            resultToName: (t, e) => t.var('items', e),
        }),
    };
    function _n(t, e) {
        if (e === !0) return t.var('props', !0);
        let r = t.var('props', (0, C._)`{}`);
        return e !== void 0 && Ir(t, r, e), r;
    }
    S.evaluatedPropsToName = _n;
    function Ir(t, e, r) {
        Object.keys(r).forEach((s) => t.assign((0, C._)`${e}${(0, C.getProperty)(s)}`, !0));
    }
    S.setEvaluated = Ir;
    var pn = {};
    function Ri(t, e) {
        return t.scopeValue('func', { ref: e, code: pn[e.code] || (pn[e.code] = new $i._Code(e.code)) });
    }
    S.useFunc = Ri;
    var Nr;
    (function (t) {
        (t[(t.Num = 0)] = 'Num'), (t[(t.Str = 1)] = 'Str');
    })(Nr || (S.Type = Nr = {}));
    function Ii(t, e, r) {
        if (t instanceof C.Name) {
            let s = e === Nr.Num;
            return r
                ? s
                    ? (0, C._)`"[" + ${t} + "]"`
                    : (0, C._)`"['" + ${t} + "']"`
                : s
                  ? (0, C._)`"/" + ${t}`
                  : (0, C._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
        }
        return r ? (0, C.getProperty)(t).toString() : `/${Rr(t)}`;
    }
    S.getErrorPath = Ii;
    function $n(t, e, r = t.opts.strictSchema) {
        if (r) {
            if (((e = `strict mode: ${e}`), r === !0)) throw new Error(e);
            t.self.logger.warn(e);
        }
    }
    S.checkStrictMode = $n;
});
var he = g((Or) => {
    'use strict';
    Object.defineProperty(Or, '__esModule', { value: !0 });
    var z = P(),
        Oi = {
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
    Or.default = Oi;
});
var nt = g((L) => {
    'use strict';
    Object.defineProperty(L, '__esModule', { value: !0 });
    L.extendErrors =
        L.resetErrorsCount =
        L.reportExtraError =
        L.reportError =
        L.keyword$DataError =
        L.keywordError =
            void 0;
    var O = P(),
        qt = T(),
        K = he();
    L.keywordError = { message: ({ keyword: t }) => (0, O.str)`must pass "${t}" keyword validation` };
    L.keyword$DataError = {
        message: ({ keyword: t, schemaType: e }) =>
            e ? (0, O.str)`"${t}" keyword must be ${e} ($data)` : (0, O.str)`"${t}" keyword is invalid ($data)`,
    };
    function ki(t, e = L.keywordError, r, s) {
        let { it: n } = t,
            { gen: o, compositeRule: a, allErrors: i } = n,
            c = En(t, e, r);
        (s ?? (a || i)) ? vn(o, c) : wn(n, (0, O._)`[${c}]`);
    }
    L.reportError = ki;
    function Ti(t, e = L.keywordError, r) {
        let { it: s } = t,
            { gen: n, compositeRule: o, allErrors: a } = s,
            i = En(t, e, r);
        vn(n, i), o || a || wn(s, K.default.vErrors);
    }
    L.reportExtraError = Ti;
    function qi(t, e) {
        t.assign(K.default.errors, e),
            t.if((0, O._)`${K.default.vErrors} !== null`, () =>
                t.if(
                    e,
                    () => t.assign((0, O._)`${K.default.vErrors}.length`, e),
                    () => t.assign(K.default.vErrors, null),
                ),
            );
    }
    L.resetErrorsCount = qi;
    function Ci({ gen: t, keyword: e, schemaValue: r, data: s, errsCount: n, it: o }) {
        if (n === void 0) throw new Error('ajv implementation error');
        let a = t.name('err');
        t.forRange('i', n, K.default.errors, (i) => {
            t.const(a, (0, O._)`${K.default.vErrors}[${i}]`),
                t.if((0, O._)`${a}.instancePath === undefined`, () =>
                    t.assign((0, O._)`${a}.instancePath`, (0, O.strConcat)(K.default.instancePath, o.errorPath)),
                ),
                t.assign((0, O._)`${a}.schemaPath`, (0, O.str)`${o.errSchemaPath}/${e}`),
                o.opts.verbose && (t.assign((0, O._)`${a}.schema`, r), t.assign((0, O._)`${a}.data`, s));
        });
    }
    L.extendErrors = Ci;
    function vn(t, e) {
        let r = t.const('err', e);
        t.if(
            (0, O._)`${K.default.vErrors} === null`,
            () => t.assign(K.default.vErrors, (0, O._)`[${r}]`),
            (0, O._)`${K.default.vErrors}.push(${r})`,
        ),
            t.code((0, O._)`${K.default.errors}++`);
    }
    function wn(t, e) {
        let { gen: r, validateName: s, schemaEnv: n } = t;
        n.$async
            ? r.throw((0, O._)`new ${t.ValidationError}(${e})`)
            : (r.assign((0, O._)`${s}.errors`, e), r.return(!1));
    }
    var Ie = {
        keyword: new O.Name('keyword'),
        schemaPath: new O.Name('schemaPath'),
        params: new O.Name('params'),
        propertyName: new O.Name('propertyName'),
        message: new O.Name('message'),
        schema: new O.Name('schema'),
        parentSchema: new O.Name('parentSchema'),
    };
    function En(t, e, r) {
        let { createErrors: s } = t.it;
        return s === !1 ? (0, O._)`{}` : Ai(t, e, r);
    }
    function Ai(t, e, r = {}) {
        let { gen: s, it: n } = t,
            o = [ji(n, r), Mi(t, r)];
        return Di(t, e, o), s.object(...o);
    }
    function ji({ errorPath: t }, { instancePath: e }) {
        let r = e ? (0, O.str)`${t}${(0, qt.getErrorPath)(e, qt.Type.Str)}` : t;
        return [K.default.instancePath, (0, O.strConcat)(K.default.instancePath, r)];
    }
    function Mi({ keyword: t, it: { errSchemaPath: e } }, { schemaPath: r, parentSchema: s }) {
        let n = s ? e : (0, O.str)`${e}/${t}`;
        return r && (n = (0, O.str)`${n}${(0, qt.getErrorPath)(r, qt.Type.Str)}`), [Ie.schemaPath, n];
    }
    function Di(t, { params: e, message: r }, s) {
        let { keyword: n, data: o, schemaValue: a, it: i } = t,
            { opts: c, propertyName: l, topSchemaRef: u, schemaPath: d } = i;
        s.push([Ie.keyword, n], [Ie.params, typeof e == 'function' ? e(t) : e || (0, O._)`{}`]),
            c.messages && s.push([Ie.message, typeof r == 'function' ? r(t) : r]),
            c.verbose && s.push([Ie.schema, a], [Ie.parentSchema, (0, O._)`${u}${d}`], [K.default.data, o]),
            l && s.push([Ie.propertyName, l]);
    }
});
var Pn = g((De) => {
    'use strict';
    Object.defineProperty(De, '__esModule', { value: !0 });
    De.boolOrEmptySchema = De.topBoolOrEmptySchema = void 0;
    var Ui = nt(),
        Vi = P(),
        xi = he(),
        zi = { message: 'boolean schema is false' };
    function Li(t) {
        let { gen: e, schema: r, validateName: s } = t;
        r === !1
            ? bn(t, !1)
            : typeof r == 'object' && r.$async === !0
              ? e.return(xi.default.data)
              : (e.assign((0, Vi._)`${s}.errors`, null), e.return(!0));
    }
    De.topBoolOrEmptySchema = Li;
    function Fi(t, e) {
        let { gen: r, schema: s } = t;
        s === !1 ? (r.var(e, !1), bn(t)) : r.var(e, !0);
    }
    De.boolOrEmptySchema = Fi;
    function bn(t, e) {
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
        (0, Ui.reportError)(n, zi, void 0, e);
    }
});
var kr = g((Ue) => {
    'use strict';
    Object.defineProperty(Ue, '__esModule', { value: !0 });
    Ue.getRules = Ue.isJSONType = void 0;
    var Ki = ['string', 'number', 'integer', 'boolean', 'null', 'object', 'array'],
        Hi = new Set(Ki);
    function Gi(t) {
        return typeof t == 'string' && Hi.has(t);
    }
    Ue.isJSONType = Gi;
    function Ji() {
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
    Ue.getRules = Ji;
});
var Tr = g((_e) => {
    'use strict';
    Object.defineProperty(_e, '__esModule', { value: !0 });
    _e.shouldUseRule = _e.shouldUseGroup = _e.schemaHasRulesForType = void 0;
    function Wi({ schema: t, self: e }, r) {
        let s = e.RULES.types[r];
        return s && s !== !0 && Sn(t, s);
    }
    _e.schemaHasRulesForType = Wi;
    function Sn(t, e) {
        return e.rules.some((r) => Nn(t, r));
    }
    _e.shouldUseGroup = Sn;
    function Nn(t, e) {
        var r;
        return (
            t[e.keyword] !== void 0 ||
            ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((s) => t[s] !== void 0))
        );
    }
    _e.shouldUseRule = Nn;
});
var ot = g((F) => {
    'use strict';
    Object.defineProperty(F, '__esModule', { value: !0 });
    F.reportTypeError =
        F.checkDataTypes =
        F.checkDataType =
        F.coerceAndCheckDataType =
        F.getJSONTypes =
        F.getSchemaTypes =
        F.DataType =
            void 0;
    var Bi = kr(),
        Qi = Tr(),
        Xi = nt(),
        E = P(),
        Rn = T(),
        Ve;
    (function (t) {
        (t[(t.Correct = 0)] = 'Correct'), (t[(t.Wrong = 1)] = 'Wrong');
    })(Ve || (F.DataType = Ve = {}));
    function Yi(t) {
        let e = In(t.type);
        if (e.includes('null')) {
            if (t.nullable === !1) throw new Error('type: null contradicts nullable: false');
        } else {
            if (!e.length && t.nullable !== void 0) throw new Error('"nullable" cannot be used without "type"');
            t.nullable === !0 && e.push('null');
        }
        return e;
    }
    F.getSchemaTypes = Yi;
    function In(t) {
        let e = Array.isArray(t) ? t : t ? [t] : [];
        if (e.every(Bi.isJSONType)) return e;
        throw new Error(`type must be JSONType or JSONType[]: ${e.join(',')}`);
    }
    F.getJSONTypes = In;
    function Zi(t, e) {
        let { gen: r, data: s, opts: n } = t,
            o = ec(e, n.coerceTypes),
            a = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, Qi.schemaHasRulesForType)(t, e[0]));
        if (a) {
            let i = Cr(e, s, n.strictNumbers, Ve.Wrong);
            r.if(i, () => {
                o.length ? tc(t, e, o) : Ar(t);
            });
        }
        return a;
    }
    F.coerceAndCheckDataType = Zi;
    var On = new Set(['string', 'number', 'integer', 'boolean', 'null']);
    function ec(t, e) {
        return e ? t.filter((r) => On.has(r) || (e === 'array' && r === 'array')) : [];
    }
    function tc(t, e, r) {
        let { gen: s, data: n, opts: o } = t,
            a = s.let('dataType', (0, E._)`typeof ${n}`),
            i = s.let('coerced', (0, E._)`undefined`);
        o.coerceTypes === 'array' &&
            s.if((0, E._)`${a} == 'object' && Array.isArray(${n}) && ${n}.length == 1`, () =>
                s
                    .assign(n, (0, E._)`${n}[0]`)
                    .assign(a, (0, E._)`typeof ${n}`)
                    .if(Cr(e, n, o.strictNumbers), () => s.assign(i, n)),
            ),
            s.if((0, E._)`${i} !== undefined`);
        for (let l of r) (On.has(l) || (l === 'array' && o.coerceTypes === 'array')) && c(l);
        s.else(),
            Ar(t),
            s.endIf(),
            s.if((0, E._)`${i} !== undefined`, () => {
                s.assign(n, i), rc(t, i);
            });
        function c(l) {
            switch (l) {
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
    function rc({ gen: t, parentData: e, parentDataProperty: r }, s) {
        t.if((0, E._)`${e} !== undefined`, () => t.assign((0, E._)`${e}[${r}]`, s));
    }
    function qr(t, e, r, s = Ve.Correct) {
        let n = s === Ve.Correct ? E.operators.EQ : E.operators.NEQ,
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
        return s === Ve.Correct ? o : (0, E.not)(o);
        function a(i = E.nil) {
            return (0, E.and)((0, E._)`typeof ${e} == "number"`, i, r ? (0, E._)`isFinite(${e})` : E.nil);
        }
    }
    F.checkDataType = qr;
    function Cr(t, e, r, s) {
        if (t.length === 1) return qr(t[0], e, r, s);
        let n,
            o = (0, Rn.toHash)(t);
        if (o.array && o.object) {
            let a = (0, E._)`typeof ${e} != "object"`;
            (n = o.null ? a : (0, E._)`!${e} || ${a}`), delete o.null, delete o.array, delete o.object;
        } else n = E.nil;
        o.number && delete o.integer;
        for (let a in o) n = (0, E.and)(n, qr(a, e, r, s));
        return n;
    }
    F.checkDataTypes = Cr;
    var sc = {
        message: ({ schema: t }) => `must be ${t}`,
        params: ({ schema: t, schemaValue: e }) =>
            typeof t == 'string' ? (0, E._)`{type: ${t}}` : (0, E._)`{type: ${e}}`,
    };
    function Ar(t) {
        let e = nc(t);
        (0, Xi.reportError)(e, sc);
    }
    F.reportTypeError = Ar;
    function nc(t) {
        let { gen: e, data: r, schema: s } = t,
            n = (0, Rn.schemaRefOrVal)(t, s, 'type');
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
var Tn = g((Ct) => {
    'use strict';
    Object.defineProperty(Ct, '__esModule', { value: !0 });
    Ct.assignDefaults = void 0;
    var xe = P(),
        oc = T();
    function ac(t, e) {
        let { properties: r, items: s } = t.schema;
        if (e === 'object' && r) for (let n in r) kn(t, n, r[n].default);
        else e === 'array' && Array.isArray(s) && s.forEach((n, o) => kn(t, o, n.default));
    }
    Ct.assignDefaults = ac;
    function kn(t, e, r) {
        let { gen: s, compositeRule: n, data: o, opts: a } = t;
        if (r === void 0) return;
        let i = (0, xe._)`${o}${(0, xe.getProperty)(e)}`;
        if (n) {
            (0, oc.checkStrictMode)(t, `default is ignored for: ${i}`);
            return;
        }
        let c = (0, xe._)`${i} === undefined`;
        a.useDefaults === 'empty' && (c = (0, xe._)`${c} || ${i} === null || ${i} === ""`),
            s.if(c, (0, xe._)`${i} = ${(0, xe.stringify)(r)}`);
    }
});
var X = g((q) => {
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
    var j = P(),
        jr = T(),
        $e = he(),
        ic = T();
    function cc(t, e) {
        let { gen: r, data: s, it: n } = t;
        r.if(Dr(r, s, e, n.opts.ownProperties), () => {
            t.setParams({ missingProperty: (0, j._)`${e}` }, !0), t.error();
        });
    }
    q.checkReportMissingProp = cc;
    function uc({ gen: t, data: e, it: { opts: r } }, s, n) {
        return (0, j.or)(...s.map((o) => (0, j.and)(Dr(t, e, o, r.ownProperties), (0, j._)`${n} = ${o}`)));
    }
    q.checkMissingProp = uc;
    function lc(t, e) {
        t.setParams({ missingProperty: e }, !0), t.error();
    }
    q.reportMissingProp = lc;
    function qn(t) {
        return t.scopeValue('func', {
            ref: Object.prototype.hasOwnProperty,
            code: (0, j._)`Object.prototype.hasOwnProperty`,
        });
    }
    q.hasPropFunc = qn;
    function Mr(t, e, r) {
        return (0, j._)`${qn(t)}.call(${e}, ${r})`;
    }
    q.isOwnProperty = Mr;
    function dc(t, e, r, s) {
        let n = (0, j._)`${e}${(0, j.getProperty)(r)} !== undefined`;
        return s ? (0, j._)`${n} && ${Mr(t, e, r)}` : n;
    }
    q.propertyInData = dc;
    function Dr(t, e, r, s) {
        let n = (0, j._)`${e}${(0, j.getProperty)(r)} === undefined`;
        return s ? (0, j.or)(n, (0, j.not)(Mr(t, e, r))) : n;
    }
    q.noPropertyInData = Dr;
    function Cn(t) {
        return t ? Object.keys(t).filter((e) => e !== '__proto__') : [];
    }
    q.allSchemaProperties = Cn;
    function fc(t, e) {
        return Cn(e).filter((r) => !(0, jr.alwaysValidSchema)(t, e[r]));
    }
    q.schemaProperties = fc;
    function hc(
        { schemaCode: t, data: e, it: { gen: r, topSchemaRef: s, schemaPath: n, errorPath: o }, it: a },
        i,
        c,
        l,
    ) {
        let u = l ? (0, j._)`${t}, ${e}, ${s}${n}` : e,
            d = [
                [$e.default.instancePath, (0, j.strConcat)($e.default.instancePath, o)],
                [$e.default.parentData, a.parentData],
                [$e.default.parentDataProperty, a.parentDataProperty],
                [$e.default.rootData, $e.default.rootData],
            ];
        a.opts.dynamicRef && d.push([$e.default.dynamicAnchors, $e.default.dynamicAnchors]);
        let y = (0, j._)`${u}, ${r.object(...d)}`;
        return c !== j.nil ? (0, j._)`${i}.call(${c}, ${y})` : (0, j._)`${i}(${y})`;
    }
    q.callValidateCode = hc;
    var pc = (0, j._)`new RegExp`;
    function mc({ gen: t, it: { opts: e } }, r) {
        let s = e.unicodeRegExp ? 'u' : '',
            { regExp: n } = e.code,
            o = n(r, s);
        return t.scopeValue('pattern', {
            key: o.toString(),
            ref: o,
            code: (0, j._)`${n.code === 'new RegExp' ? pc : (0, ic.useFunc)(t, n)}(${r}, ${s})`,
        });
    }
    q.usePattern = mc;
    function yc(t) {
        let { gen: e, data: r, keyword: s, it: n } = t,
            o = e.name('valid');
        if (n.allErrors) {
            let i = e.let('valid', !0);
            return a(() => e.assign(i, !1)), i;
        }
        return e.var(o, !0), a(() => e.break()), o;
        function a(i) {
            let c = e.const('len', (0, j._)`${r}.length`);
            e.forRange('i', 0, c, (l) => {
                t.subschema({ keyword: s, dataProp: l, dataPropType: jr.Type.Num }, o), e.if((0, j.not)(o), i);
            });
        }
    }
    q.validateArray = yc;
    function gc(t) {
        let { gen: e, schema: r, keyword: s, it: n } = t;
        if (!Array.isArray(r)) throw new Error('ajv implementation error');
        if (r.some((c) => (0, jr.alwaysValidSchema)(n, c)) && !n.opts.unevaluated) return;
        let a = e.let('valid', !1),
            i = e.name('_valid');
        e.block(() =>
            r.forEach((c, l) => {
                let u = t.subschema({ keyword: s, schemaProp: l, compositeRule: !0 }, i);
                e.assign(a, (0, j._)`${a} || ${i}`), t.mergeValidEvaluated(u, i) || e.if((0, j.not)(a));
            }),
        ),
            t.result(
                a,
                () => t.reset(),
                () => t.error(!0),
            );
    }
    q.validateUnion = gc;
});
var Mn = g((ae) => {
    'use strict';
    Object.defineProperty(ae, '__esModule', { value: !0 });
    ae.validateKeywordUsage = ae.validSchemaType = ae.funcKeywordCode = ae.macroKeywordCode = void 0;
    var H = P(),
        Oe = he(),
        _c = X(),
        $c = nt();
    function vc(t, e) {
        let { gen: r, keyword: s, schema: n, parentSchema: o, it: a } = t,
            i = e.macro.call(a.self, n, o, a),
            c = jn(r, s, i);
        a.opts.validateSchema !== !1 && a.self.validateSchema(i, !0);
        let l = r.name('valid');
        t.subschema(
            {
                schema: i,
                schemaPath: H.nil,
                errSchemaPath: `${a.errSchemaPath}/${s}`,
                topSchemaRef: c,
                compositeRule: !0,
            },
            l,
        ),
            t.pass(l, () => t.error(!0));
    }
    ae.macroKeywordCode = vc;
    function wc(t, e) {
        var r;
        let { gen: s, keyword: n, schema: o, parentSchema: a, $data: i, it: c } = t;
        bc(c, e);
        let l = !i && e.compile ? e.compile.call(c.self, o, a, c) : e.validate,
            u = jn(s, n, l),
            d = s.let('valid');
        t.block$data(d, y), t.ok((r = e.valid) !== null && r !== void 0 ? r : d);
        function y() {
            if (e.errors === !1) f(), e.modifying && An(t), p(() => t.error());
            else {
                let _ = e.async ? m() : h();
                e.modifying && An(t), p(() => Ec(t, _));
            }
        }
        function m() {
            let _ = s.let('ruleErrs', null);
            return (
                s.try(
                    () => f((0, H._)`await `),
                    (I) =>
                        s.assign(d, !1).if(
                            (0, H._)`${I} instanceof ${c.ValidationError}`,
                            () => s.assign(_, (0, H._)`${I}.errors`),
                            () => s.throw(I),
                        ),
                ),
                _
            );
        }
        function h() {
            let _ = (0, H._)`${u}.errors`;
            return s.assign(_, null), f(H.nil), _;
        }
        function f(_ = e.async ? (0, H._)`await ` : H.nil) {
            let I = c.opts.passContext ? Oe.default.this : Oe.default.self,
                N = !(('compile' in e && !i) || e.schema === !1);
            s.assign(d, (0, H._)`${_}${(0, _c.callValidateCode)(t, u, I, N)}`, e.modifying);
        }
        function p(_) {
            var I;
            s.if((0, H.not)((I = e.valid) !== null && I !== void 0 ? I : d), _);
        }
    }
    ae.funcKeywordCode = wc;
    function An(t) {
        let { gen: e, data: r, it: s } = t;
        e.if(s.parentData, () => e.assign(r, (0, H._)`${s.parentData}[${s.parentDataProperty}]`));
    }
    function Ec(t, e) {
        let { gen: r } = t;
        r.if(
            (0, H._)`Array.isArray(${e})`,
            () => {
                r
                    .assign(
                        Oe.default.vErrors,
                        (0, H._)`${Oe.default.vErrors} === null ? ${e} : ${Oe.default.vErrors}.concat(${e})`,
                    )
                    .assign(Oe.default.errors, (0, H._)`${Oe.default.vErrors}.length`),
                    (0, $c.extendErrors)(t);
            },
            () => t.error(),
        );
    }
    function bc({ schemaEnv: t }, e) {
        if (e.async && !t.$async) throw new Error('async keyword in sync schema');
    }
    function jn(t, e, r) {
        if (r === void 0) throw new Error(`keyword "${e}" failed to compile`);
        return t.scopeValue('keyword', typeof r == 'function' ? { ref: r } : { ref: r, code: (0, H.stringify)(r) });
    }
    function Pc(t, e, r = !1) {
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
    ae.validSchemaType = Pc;
    function Sc({ schema: t, opts: e, self: r, errSchemaPath: s }, n, o) {
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
    ae.validateKeywordUsage = Sc;
});
var Un = g((ve) => {
    'use strict';
    Object.defineProperty(ve, '__esModule', { value: !0 });
    ve.extendSubschemaMode = ve.extendSubschemaData = ve.getSubschema = void 0;
    var ie = P(),
        Dn = T();
    function Nc(t, { keyword: e, schemaProp: r, schema: s, schemaPath: n, errSchemaPath: o, topSchemaRef: a }) {
        if (e !== void 0 && s !== void 0) throw new Error('both "keyword" and "schema" passed, only one allowed');
        if (e !== void 0) {
            let i = t.schema[e];
            return r === void 0
                ? {
                      schema: i,
                      schemaPath: (0, ie._)`${t.schemaPath}${(0, ie.getProperty)(e)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}`,
                  }
                : {
                      schema: i[r],
                      schemaPath: (0, ie._)`${t.schemaPath}${(0, ie.getProperty)(e)}${(0, ie.getProperty)(r)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Dn.escapeFragment)(r)}`,
                  };
        }
        if (s !== void 0) {
            if (n === void 0 || o === void 0 || a === void 0)
                throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return { schema: s, schemaPath: n, topSchemaRef: a, errSchemaPath: o };
        }
        throw new Error('either "keyword" or "schema" must be passed');
    }
    ve.getSubschema = Nc;
    function Rc(t, e, { dataProp: r, dataPropType: s, data: n, dataTypes: o, propertyName: a }) {
        if (n !== void 0 && r !== void 0) throw new Error('both "data" and "dataProp" passed, only one allowed');
        let { gen: i } = e;
        if (r !== void 0) {
            let { errorPath: l, dataPathArr: u, opts: d } = e,
                y = i.let('data', (0, ie._)`${e.data}${(0, ie.getProperty)(r)}`, !0);
            c(y),
                (t.errorPath = (0, ie.str)`${l}${(0, Dn.getErrorPath)(r, s, d.jsPropertySyntax)}`),
                (t.parentDataProperty = (0, ie._)`${r}`),
                (t.dataPathArr = [...u, t.parentDataProperty]);
        }
        if (n !== void 0) {
            let l = n instanceof ie.Name ? n : i.let('data', n, !0);
            c(l), a !== void 0 && (t.propertyName = a);
        }
        o && (t.dataTypes = o);
        function c(l) {
            (t.data = l),
                (t.dataLevel = e.dataLevel + 1),
                (t.dataTypes = []),
                (e.definedProperties = new Set()),
                (t.parentData = e.data),
                (t.dataNames = [...e.dataNames, l]);
        }
    }
    ve.extendSubschemaData = Rc;
    function Ic(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: s, createErrors: n, allErrors: o }) {
        s !== void 0 && (t.compositeRule = s),
            n !== void 0 && (t.createErrors = n),
            o !== void 0 && (t.allErrors = o),
            (t.jtdDiscriminator = e),
            (t.jtdMetadata = r);
    }
    ve.extendSubschemaMode = Ic;
});
var Ur = g((Th, Vn) => {
    'use strict';
    Vn.exports = function t(e, r) {
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
var zn = g((qh, xn) => {
    'use strict';
    var we = (xn.exports = function (t, e, r) {
        typeof e == 'function' && ((r = e), (e = {})), (r = e.cb || r);
        var s = typeof r == 'function' ? r : r.pre || function () {},
            n = r.post || function () {};
        At(e, s, n, t, '', t);
    });
    we.keywords = {
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
    we.arrayKeywords = { items: !0, allOf: !0, anyOf: !0, oneOf: !0 };
    we.propsKeywords = { $defs: !0, definitions: !0, properties: !0, patternProperties: !0, dependencies: !0 };
    we.skipKeywords = {
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
    function At(t, e, r, s, n, o, a, i, c, l) {
        if (s && typeof s == 'object' && !Array.isArray(s)) {
            e(s, n, o, a, i, c, l);
            for (var u in s) {
                var d = s[u];
                if (Array.isArray(d)) {
                    if (u in we.arrayKeywords)
                        for (var y = 0; y < d.length; y++) At(t, e, r, d[y], `${n}/${u}/${y}`, o, n, u, s, y);
                } else if (u in we.propsKeywords) {
                    if (d && typeof d == 'object')
                        for (var m in d) At(t, e, r, d[m], `${n}/${u}/${Oc(m)}`, o, n, u, s, m);
                } else
                    (u in we.keywords || (t.allKeys && !(u in we.skipKeywords))) &&
                        At(t, e, r, d, `${n}/${u}`, o, n, u, s);
            }
            r(s, n, o, a, i, c, l);
        }
    }
    function Oc(t) {
        return t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
});
var at = g((W) => {
    'use strict';
    Object.defineProperty(W, '__esModule', { value: !0 });
    W.getSchemaRefs = W.resolveUrl = W.normalizeId = W._getFullPath = W.getFullPath = W.inlineRef = void 0;
    var kc = T(),
        Tc = Ur(),
        qc = zn(),
        Cc = new Set([
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
    function Ac(t, e = !0) {
        return typeof t == 'boolean' ? !0 : e === !0 ? !Vr(t) : e ? Ln(t) <= e : !1;
    }
    W.inlineRef = Ac;
    var jc = new Set(['$ref', '$recursiveRef', '$recursiveAnchor', '$dynamicRef', '$dynamicAnchor']);
    function Vr(t) {
        for (let e in t) {
            if (jc.has(e)) return !0;
            let r = t[e];
            if ((Array.isArray(r) && r.some(Vr)) || (typeof r == 'object' && Vr(r))) return !0;
        }
        return !1;
    }
    function Ln(t) {
        let e = 0;
        for (let r in t) {
            if (r === '$ref') return 1 / 0;
            if (
                (e++,
                !Cc.has(r) && (typeof t[r] == 'object' && (0, kc.eachItem)(t[r], (s) => (e += Ln(s))), e === 1 / 0))
            )
                return 1 / 0;
        }
        return e;
    }
    function Fn(t, e = '', r) {
        r !== !1 && (e = ze(e));
        let s = t.parse(e);
        return Kn(t, s);
    }
    W.getFullPath = Fn;
    function Kn(t, e) {
        return `${t.serialize(e).split('#')[0]}#`;
    }
    W._getFullPath = Kn;
    var Mc = /#\/?$/;
    function ze(t) {
        return t ? t.replace(Mc, '') : '';
    }
    W.normalizeId = ze;
    function Dc(t, e, r) {
        return (r = ze(r)), t.resolve(e, r);
    }
    W.resolveUrl = Dc;
    var Uc = /^[a-z_][-a-z0-9._]*$/i;
    function Vc(t, e) {
        if (typeof t == 'boolean') return {};
        let { schemaId: r, uriResolver: s } = this.opts,
            n = ze(t[r] || e),
            o = { '': n },
            a = Fn(s, n, !1),
            i = {},
            c = new Set();
        return (
            qc(t, { allKeys: !0 }, (d, y, m, h) => {
                if (h === void 0) return;
                let f = a + y,
                    p = o[h];
                typeof d[r] == 'string' && (p = _.call(this, d[r])),
                    I.call(this, d.$anchor),
                    I.call(this, d.$dynamicAnchor),
                    (o[y] = p);
                function _(N) {
                    let A = this.opts.uriResolver.resolve;
                    if (((N = ze(p ? A(p, N) : N)), c.has(N))) throw u(N);
                    c.add(N);
                    let w = this.refs[N];
                    return (
                        typeof w == 'string' && (w = this.refs[w]),
                        typeof w == 'object'
                            ? l(d, w.schema, N)
                            : N !== ze(f) && (N[0] === '#' ? (l(d, i[N], N), (i[N] = d)) : (this.refs[N] = f)),
                        N
                    );
                }
                function I(N) {
                    if (typeof N == 'string') {
                        if (!Uc.test(N)) throw new Error(`invalid anchor "${N}"`);
                        _.call(this, `#${N}`);
                    }
                }
            }),
            i
        );
        function l(d, y, m) {
            if (y !== void 0 && !Tc(d, y)) throw u(m);
        }
        function u(d) {
            return new Error(`reference "${d}" resolves to more than one schema`);
        }
    }
    W.getSchemaRefs = Vc;
});
var ut = g((Ee) => {
    'use strict';
    Object.defineProperty(Ee, '__esModule', { value: !0 });
    Ee.getData = Ee.KeywordCxt = Ee.validateFunctionCode = void 0;
    var Bn = Pn(),
        Hn = ot(),
        zr = Tr(),
        jt = ot(),
        xc = Tn(),
        ct = Mn(),
        xr = Un(),
        $ = P(),
        v = he(),
        zc = at(),
        pe = T(),
        it = nt();
    function Lc(t) {
        if (Yn(t) && (Zn(t), Xn(t))) {
            Hc(t);
            return;
        }
        Qn(t, () => (0, Bn.topBoolOrEmptySchema)(t));
    }
    Ee.validateFunctionCode = Lc;
    function Qn({ gen: t, validateName: e, schema: r, schemaEnv: s, opts: n }, o) {
        n.code.es5
            ? t.func(e, (0, $._)`${v.default.data}, ${v.default.valCxt}`, s.$async, () => {
                  t.code((0, $._)`"use strict"; ${Gn(r, n)}`), Kc(t, n), t.code(o);
              })
            : t.func(e, (0, $._)`${v.default.data}, ${Fc(n)}`, s.$async, () => t.code(Gn(r, n)).code(o));
    }
    function Fc(t) {
        return (0,
        $._)`{${v.default.instancePath}="", ${v.default.parentData}, ${v.default.parentDataProperty}, ${v.default.rootData}=${v.default.data}${t.dynamicRef ? (0, $._)`, ${v.default.dynamicAnchors}={}` : $.nil}}={}`;
    }
    function Kc(t, e) {
        t.if(
            v.default.valCxt,
            () => {
                t.var(v.default.instancePath, (0, $._)`${v.default.valCxt}.${v.default.instancePath}`),
                    t.var(v.default.parentData, (0, $._)`${v.default.valCxt}.${v.default.parentData}`),
                    t.var(v.default.parentDataProperty, (0, $._)`${v.default.valCxt}.${v.default.parentDataProperty}`),
                    t.var(v.default.rootData, (0, $._)`${v.default.valCxt}.${v.default.rootData}`),
                    e.dynamicRef &&
                        t.var(v.default.dynamicAnchors, (0, $._)`${v.default.valCxt}.${v.default.dynamicAnchors}`);
            },
            () => {
                t.var(v.default.instancePath, (0, $._)`""`),
                    t.var(v.default.parentData, (0, $._)`undefined`),
                    t.var(v.default.parentDataProperty, (0, $._)`undefined`),
                    t.var(v.default.rootData, v.default.data),
                    e.dynamicRef && t.var(v.default.dynamicAnchors, (0, $._)`{}`);
            },
        );
    }
    function Hc(t) {
        let { schema: e, opts: r, gen: s } = t;
        Qn(t, () => {
            r.$comment && e.$comment && to(t),
                Qc(t),
                s.let(v.default.vErrors, null),
                s.let(v.default.errors, 0),
                r.unevaluated && Gc(t),
                eo(t),
                Zc(t);
        });
    }
    function Gc(t) {
        let { gen: e, validateName: r } = t;
        (t.evaluated = e.const('evaluated', (0, $._)`${r}.evaluated`)),
            e.if((0, $._)`${t.evaluated}.dynamicProps`, () =>
                e.assign((0, $._)`${t.evaluated}.props`, (0, $._)`undefined`),
            ),
            e.if((0, $._)`${t.evaluated}.dynamicItems`, () =>
                e.assign((0, $._)`${t.evaluated}.items`, (0, $._)`undefined`),
            );
    }
    function Gn(t, e) {
        let r = typeof t == 'object' && t[e.schemaId];
        return r && (e.code.source || e.code.process) ? (0, $._)`/*# sourceURL=${r} */` : $.nil;
    }
    function Jc(t, e) {
        if (Yn(t) && (Zn(t), Xn(t))) {
            Wc(t, e);
            return;
        }
        (0, Bn.boolOrEmptySchema)(t, e);
    }
    function Xn({ schema: t, self: e }) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e.RULES.all[r]) return !0;
        return !1;
    }
    function Yn(t) {
        return typeof t.schema != 'boolean';
    }
    function Wc(t, e) {
        let { schema: r, gen: s, opts: n } = t;
        n.$comment && r.$comment && to(t), Xc(t), Yc(t);
        let o = s.const('_errs', v.default.errors);
        eo(t, o), s.var(e, (0, $._)`${o} === ${v.default.errors}`);
    }
    function Zn(t) {
        (0, pe.checkUnknownRules)(t), Bc(t);
    }
    function eo(t, e) {
        if (t.opts.jtd) return Jn(t, [], !1, e);
        let r = (0, Hn.getSchemaTypes)(t.schema),
            s = (0, Hn.coerceAndCheckDataType)(t, r);
        Jn(t, r, !s, e);
    }
    function Bc(t) {
        let { schema: e, errSchemaPath: r, opts: s, self: n } = t;
        e.$ref &&
            s.ignoreKeywordsWithRef &&
            (0, pe.schemaHasRulesButRef)(e, n.RULES) &&
            n.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
    }
    function Qc(t) {
        let { schema: e, opts: r } = t;
        e.default !== void 0 &&
            r.useDefaults &&
            r.strictSchema &&
            (0, pe.checkStrictMode)(t, 'default is ignored in the schema root');
    }
    function Xc(t) {
        let e = t.schema[t.opts.schemaId];
        e && (t.baseId = (0, zc.resolveUrl)(t.opts.uriResolver, t.baseId, e));
    }
    function Yc(t) {
        if (t.schema.$async && !t.schemaEnv.$async) throw new Error('async schema in sync schema');
    }
    function to({ gen: t, schemaEnv: e, schema: r, errSchemaPath: s, opts: n }) {
        let o = r.$comment;
        if (n.$comment === !0) t.code((0, $._)`${v.default.self}.logger.log(${o})`);
        else if (typeof n.$comment == 'function') {
            let a = (0, $.str)`${s}/$comment`,
                i = t.scopeValue('root', { ref: e.root });
            t.code((0, $._)`${v.default.self}.opts.$comment(${o}, ${a}, ${i}.schema)`);
        }
    }
    function Zc(t) {
        let { gen: e, schemaEnv: r, validateName: s, ValidationError: n, opts: o } = t;
        r.$async
            ? e.if(
                  (0, $._)`${v.default.errors} === 0`,
                  () => e.return(v.default.data),
                  () => e.throw((0, $._)`new ${n}(${v.default.vErrors})`),
              )
            : (e.assign((0, $._)`${s}.errors`, v.default.vErrors),
              o.unevaluated && eu(t),
              e.return((0, $._)`${v.default.errors} === 0`));
    }
    function eu({ gen: t, evaluated: e, props: r, items: s }) {
        r instanceof $.Name && t.assign((0, $._)`${e}.props`, r),
            s instanceof $.Name && t.assign((0, $._)`${e}.items`, s);
    }
    function Jn(t, e, r, s) {
        let { gen: n, schema: o, data: a, allErrors: i, opts: c, self: l } = t,
            { RULES: u } = l;
        if (o.$ref && (c.ignoreKeywordsWithRef || !(0, pe.schemaHasRulesButRef)(o, u))) {
            n.block(() => so(t, '$ref', u.all.$ref.definition));
            return;
        }
        c.jtd || tu(t, e),
            n.block(() => {
                for (let y of u.rules) d(y);
                d(u.post);
            });
        function d(y) {
            (0, zr.shouldUseGroup)(o, y) &&
                (y.type
                    ? (n.if((0, jt.checkDataType)(y.type, a, c.strictNumbers)),
                      Wn(t, y),
                      e.length === 1 && e[0] === y.type && r && (n.else(), (0, jt.reportTypeError)(t)),
                      n.endIf())
                    : Wn(t, y),
                i || n.if((0, $._)`${v.default.errors} === ${s || 0}`));
        }
    }
    function Wn(t, e) {
        let {
            gen: r,
            schema: s,
            opts: { useDefaults: n },
        } = t;
        n && (0, xc.assignDefaults)(t, e.type),
            r.block(() => {
                for (let o of e.rules) (0, zr.shouldUseRule)(s, o) && so(t, o.keyword, o.definition, e.type);
            });
    }
    function tu(t, e) {
        t.schemaEnv.meta || !t.opts.strictTypes || (ru(t, e), t.opts.allowUnionTypes || su(t, e), nu(t, t.dataTypes));
    }
    function ru(t, e) {
        if (e.length) {
            if (!t.dataTypes.length) {
                t.dataTypes = e;
                return;
            }
            e.forEach((r) => {
                ro(t.dataTypes, r) || Lr(t, `type "${r}" not allowed by context "${t.dataTypes.join(',')}"`);
            }),
                au(t, e);
        }
    }
    function su(t, e) {
        e.length > 1 &&
            !(e.length === 2 && e.includes('null')) &&
            Lr(t, 'use allowUnionTypes to allow union type keyword');
    }
    function nu(t, e) {
        let r = t.self.RULES.all;
        for (let s in r) {
            let n = r[s];
            if (typeof n == 'object' && (0, zr.shouldUseRule)(t.schema, n)) {
                let { type: o } = n.definition;
                o.length && !o.some((a) => ou(e, a)) && Lr(t, `missing type "${o.join(',')}" for keyword "${s}"`);
            }
        }
    }
    function ou(t, e) {
        return t.includes(e) || (e === 'number' && t.includes('integer'));
    }
    function ro(t, e) {
        return t.includes(e) || (e === 'integer' && t.includes('number'));
    }
    function au(t, e) {
        let r = [];
        for (let s of t.dataTypes) ro(e, s) ? r.push(s) : e.includes('integer') && s === 'number' && r.push('integer');
        t.dataTypes = r;
    }
    function Lr(t, e) {
        let r = t.schemaEnv.baseId + t.errSchemaPath;
        (e += ` at "${r}" (strictTypes)`), (0, pe.checkStrictMode)(t, e, t.opts.strictTypes);
    }
    var Mt = class {
        constructor(e, r, s) {
            if (
                ((0, ct.validateKeywordUsage)(e, r, s),
                (this.gen = e.gen),
                (this.allErrors = e.allErrors),
                (this.keyword = s),
                (this.data = e.data),
                (this.schema = e.schema[s]),
                (this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data),
                (this.schemaValue = (0, pe.schemaRefOrVal)(e, this.schema, s, this.$data)),
                (this.schemaType = r.schemaType),
                (this.parentSchema = e.schema),
                (this.params = {}),
                (this.it = e),
                (this.def = r),
                this.$data)
            )
                this.schemaCode = e.gen.const('vSchema', no(this.$data, e));
            else if (
                ((this.schemaCode = this.schemaValue),
                !(0, ct.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
            )
                throw new Error(`${s} value must be ${JSON.stringify(r.schemaType)}`);
            ('code' in r ? r.trackErrors : r.errors !== !1) &&
                (this.errsCount = e.gen.const('_errs', v.default.errors));
        }
        result(e, r, s) {
            this.failResult((0, $.not)(e), r, s);
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
            this.failResult((0, $.not)(e), void 0, r);
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
            this.fail((0, $._)`${r} !== undefined && (${(0, $.or)(this.invalid$data(), e)})`);
        }
        error(e, r, s) {
            if (r) {
                this.setParams(r), this._error(e, s), this.setParams({});
                return;
            }
            this._error(e, s);
        }
        _error(e, r) {
            (e ? it.reportExtraError : it.reportError)(this, this.def.error, r);
        }
        $dataError() {
            (0, it.reportError)(this, this.def.$dataError || it.keyword$DataError);
        }
        reset() {
            if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
            (0, it.resetErrorsCount)(this.gen, this.errsCount);
        }
        ok(e) {
            this.allErrors || this.gen.if(e);
        }
        setParams(e, r) {
            r ? Object.assign(this.params, e) : (this.params = e);
        }
        block$data(e, r, s = $.nil) {
            this.gen.block(() => {
                this.check$data(e, s), r();
            });
        }
        check$data(e = $.nil, r = $.nil) {
            if (!this.$data) return;
            let { gen: s, schemaCode: n, schemaType: o, def: a } = this;
            s.if((0, $.or)((0, $._)`${n} === undefined`, r)),
                e !== $.nil && s.assign(e, !0),
                (o.length || a.validateSchema) &&
                    (s.elseIf(this.invalid$data()), this.$dataError(), e !== $.nil && s.assign(e, !1)),
                s.else();
        }
        invalid$data() {
            let { gen: e, schemaCode: r, schemaType: s, def: n, it: o } = this;
            return (0, $.or)(a(), i());
            function a() {
                if (s.length) {
                    if (!(r instanceof $.Name)) throw new Error('ajv implementation error');
                    let c = Array.isArray(s) ? s : [s];
                    return (0, $._)`${(0, jt.checkDataTypes)(c, r, o.opts.strictNumbers, jt.DataType.Wrong)}`;
                }
                return $.nil;
            }
            function i() {
                if (n.validateSchema) {
                    let c = e.scopeValue('validate$data', { ref: n.validateSchema });
                    return (0, $._)`!${c}(${r})`;
                }
                return $.nil;
            }
        }
        subschema(e, r) {
            let s = (0, xr.getSubschema)(this.it, e);
            (0, xr.extendSubschemaData)(s, this.it, e), (0, xr.extendSubschemaMode)(s, e);
            let n = { ...this.it, ...s, items: void 0, props: void 0 };
            return Jc(n, r), n;
        }
        mergeEvaluated(e, r) {
            let { it: s, gen: n } = this;
            s.opts.unevaluated &&
                (s.props !== !0 && e.props !== void 0 && (s.props = pe.mergeEvaluated.props(n, e.props, s.props, r)),
                s.items !== !0 && e.items !== void 0 && (s.items = pe.mergeEvaluated.items(n, e.items, s.items, r)));
        }
        mergeValidEvaluated(e, r) {
            let { it: s, gen: n } = this;
            if (s.opts.unevaluated && (s.props !== !0 || s.items !== !0))
                return n.if(r, () => this.mergeEvaluated(e, $.Name)), !0;
        }
    };
    Ee.KeywordCxt = Mt;
    function so(t, e, r, s) {
        let n = new Mt(t, r, e);
        'code' in r
            ? r.code(n, s)
            : n.$data && r.validate
              ? (0, ct.funcKeywordCode)(n, r)
              : 'macro' in r
                ? (0, ct.macroKeywordCode)(n, r)
                : (r.compile || r.validate) && (0, ct.funcKeywordCode)(n, r);
    }
    var iu = /^\/(?:[^~]|~0|~1)*$/,
        cu = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function no(t, { dataLevel: e, dataNames: r, dataPathArr: s }) {
        let n, o;
        if (t === '') return v.default.rootData;
        if (t[0] === '/') {
            if (!iu.test(t)) throw new Error(`Invalid JSON-pointer: ${t}`);
            (n = t), (o = v.default.rootData);
        } else {
            let l = cu.exec(t);
            if (!l) throw new Error(`Invalid JSON-pointer: ${t}`);
            let u = +l[1];
            if (((n = l[2]), n === '#')) {
                if (u >= e) throw new Error(c('property/index', u));
                return s[e - u];
            }
            if (u > e) throw new Error(c('data', u));
            if (((o = r[e - u]), !n)) return o;
        }
        let a = o,
            i = n.split('/');
        for (let l of i)
            l &&
                ((o = (0, $._)`${o}${(0, $.getProperty)((0, pe.unescapeJsonPointer)(l))}`),
                (a = (0, $._)`${a} && ${o}`));
        return a;
        function c(l, u) {
            return `Cannot access ${l} ${u} levels up, current level is ${e}`;
        }
    }
    Ee.getData = no;
});
var Dt = g((Kr) => {
    'use strict';
    Object.defineProperty(Kr, '__esModule', { value: !0 });
    var Fr = class extends Error {
        constructor(e) {
            super('validation failed'), (this.errors = e), (this.ajv = this.validation = !0);
        }
    };
    Kr.default = Fr;
});
var lt = g((Jr) => {
    'use strict';
    Object.defineProperty(Jr, '__esModule', { value: !0 });
    var Hr = at(),
        Gr = class extends Error {
            constructor(e, r, s, n) {
                super(n || `can't resolve reference ${s} from id ${r}`),
                    (this.missingRef = (0, Hr.resolveUrl)(e, r, s)),
                    (this.missingSchema = (0, Hr.normalizeId)((0, Hr.getFullPath)(e, this.missingRef)));
            }
        };
    Jr.default = Gr;
});
var Vt = g((Y) => {
    'use strict';
    Object.defineProperty(Y, '__esModule', { value: !0 });
    Y.resolveSchema = Y.getCompilingSchema = Y.resolveRef = Y.compileSchema = Y.SchemaEnv = void 0;
    var te = P(),
        uu = Dt(),
        ke = he(),
        re = at(),
        oo = T(),
        lu = ut(),
        Le = class {
            constructor(e) {
                var r;
                (this.refs = {}), (this.dynamicAnchors = {});
                let s;
                typeof e.schema == 'object' && (s = e.schema),
                    (this.schema = e.schema),
                    (this.schemaId = e.schemaId),
                    (this.root = e.root || this),
                    (this.baseId =
                        (r = e.baseId) !== null && r !== void 0 ? r : (0, re.normalizeId)(s?.[e.schemaId || '$id'])),
                    (this.schemaPath = e.schemaPath),
                    (this.localRefs = e.localRefs),
                    (this.meta = e.meta),
                    (this.$async = s?.$async),
                    (this.refs = {});
            }
        };
    Y.SchemaEnv = Le;
    function Br(t) {
        let e = ao.call(this, t);
        if (e) return e;
        let r = (0, re.getFullPath)(this.opts.uriResolver, t.root.baseId),
            { es5: s, lines: n } = this.opts.code,
            { ownProperties: o } = this.opts,
            a = new te.CodeGen(this.scope, { es5: s, lines: n, ownProperties: o }),
            i;
        t.$async &&
            (i = a.scopeValue('Error', {
                ref: uu.default,
                code: (0, te._)`require("ajv/dist/runtime/validation_error").default`,
            }));
        let c = a.scopeName('validate');
        t.validateName = c;
        let l = {
                gen: a,
                allErrors: this.opts.allErrors,
                data: ke.default.data,
                parentData: ke.default.parentData,
                parentDataProperty: ke.default.parentDataProperty,
                dataNames: [ke.default.data],
                dataPathArr: [te.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set(),
                topSchemaRef: a.scopeValue(
                    'schema',
                    this.opts.code.source === !0
                        ? { ref: t.schema, code: (0, te.stringify)(t.schema) }
                        : { ref: t.schema },
                ),
                validateName: c,
                ValidationError: i,
                schema: t.schema,
                schemaEnv: t,
                rootId: r,
                baseId: t.baseId || r,
                schemaPath: te.nil,
                errSchemaPath: t.schemaPath || (this.opts.jtd ? '' : '#'),
                errorPath: (0, te._)`""`,
                opts: this.opts,
                self: this,
            },
            u;
        try {
            this._compilations.add(t), (0, lu.validateFunctionCode)(l), a.optimize(this.opts.code.optimize);
            let d = a.toString();
            (u = `${a.scopeRefs(ke.default.scope)}return ${d}`),
                this.opts.code.process && (u = this.opts.code.process(u, t));
            let m = new Function(`${ke.default.self}`, `${ke.default.scope}`, u)(this, this.scope.get());
            if (
                (this.scope.value(c, { ref: m }),
                (m.errors = null),
                (m.schema = t.schema),
                (m.schemaEnv = t),
                t.$async && (m.$async = !0),
                this.opts.code.source === !0 &&
                    (m.source = { validateName: c, validateCode: d, scopeValues: a._values }),
                this.opts.unevaluated)
            ) {
                let { props: h, items: f } = l;
                (m.evaluated = {
                    props: h instanceof te.Name ? void 0 : h,
                    items: f instanceof te.Name ? void 0 : f,
                    dynamicProps: h instanceof te.Name,
                    dynamicItems: f instanceof te.Name,
                }),
                    m.source && (m.source.evaluated = (0, te.stringify)(m.evaluated));
            }
            return (t.validate = m), t;
        } catch (d) {
            throw (
                (delete t.validate,
                delete t.validateName,
                u && this.logger.error('Error compiling schema, function code:', u),
                d)
            );
        } finally {
            this._compilations.delete(t);
        }
    }
    Y.compileSchema = Br;
    function du(t, e, r) {
        var s;
        r = (0, re.resolveUrl)(this.opts.uriResolver, e, r);
        let n = t.refs[r];
        if (n) return n;
        let o = pu.call(this, t, r);
        if (o === void 0) {
            let a = (s = t.localRefs) === null || s === void 0 ? void 0 : s[r],
                { schemaId: i } = this.opts;
            a && (o = new Le({ schema: a, schemaId: i, root: t, baseId: e }));
        }
        if (o !== void 0) return (t.refs[r] = fu.call(this, o));
    }
    Y.resolveRef = du;
    function fu(t) {
        return (0, re.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : Br.call(this, t);
    }
    function ao(t) {
        for (let e of this._compilations) if (hu(e, t)) return e;
    }
    Y.getCompilingSchema = ao;
    function hu(t, e) {
        return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
    }
    function pu(t, e) {
        let r;
        for (; typeof (r = this.refs[e]) == 'string'; ) e = r;
        return r || this.schemas[e] || Ut.call(this, t, e);
    }
    function Ut(t, e) {
        let r = this.opts.uriResolver.parse(e),
            s = (0, re._getFullPath)(this.opts.uriResolver, r),
            n = (0, re.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
        if (Object.keys(t.schema).length > 0 && s === n) return Wr.call(this, r, t);
        let o = (0, re.normalizeId)(s),
            a = this.refs[o] || this.schemas[o];
        if (typeof a == 'string') {
            let i = Ut.call(this, t, a);
            return typeof i?.schema != 'object' ? void 0 : Wr.call(this, r, i);
        }
        if (typeof a?.schema == 'object') {
            if ((a.validate || Br.call(this, a), o === (0, re.normalizeId)(e))) {
                let { schema: i } = a,
                    { schemaId: c } = this.opts,
                    l = i[c];
                return (
                    l && (n = (0, re.resolveUrl)(this.opts.uriResolver, n, l)),
                    new Le({ schema: i, schemaId: c, root: t, baseId: n })
                );
            }
            return Wr.call(this, r, a);
        }
    }
    Y.resolveSchema = Ut;
    var mu = new Set(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
    function Wr(t, { baseId: e, schema: r, root: s }) {
        var n;
        if (((n = t.fragment) === null || n === void 0 ? void 0 : n[0]) !== '/') return;
        for (let i of t.fragment.slice(1).split('/')) {
            if (typeof r == 'boolean') return;
            let c = r[(0, oo.unescapeFragment)(i)];
            if (c === void 0) return;
            r = c;
            let l = typeof r == 'object' && r[this.opts.schemaId];
            !mu.has(i) && l && (e = (0, re.resolveUrl)(this.opts.uriResolver, e, l));
        }
        let o;
        if (typeof r != 'boolean' && r.$ref && !(0, oo.schemaHasRulesButRef)(r, this.RULES)) {
            let i = (0, re.resolveUrl)(this.opts.uriResolver, e, r.$ref);
            o = Ut.call(this, s, i);
        }
        let { schemaId: a } = this.opts;
        if (((o = o || new Le({ schema: r, schemaId: a, root: s, baseId: e })), o.schema !== o.root.schema)) return o;
    }
});
var io = g((Uh, yu) => {
    yu.exports = {
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
var uo = g((Vh, co) => {
    'use strict';
    var gu = {
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
    co.exports = { HEX: gu };
});
var _o = g((xh, go) => {
    'use strict';
    var { HEX: _u } = uo();
    function po(t) {
        if (yo(t, '.') < 3) return { host: t, isIPV4: !1 };
        let e =
                t.match(
                    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u,
                ) || [],
            [r] = e;
        return r ? { host: vu(r, '.'), isIPV4: !0 } : { host: t, isIPV4: !1 };
    }
    function Qr(t, e = !1) {
        let r = '',
            s = !0;
        for (let n of t) {
            if (_u[n] === void 0) return;
            n !== '0' && s === !0 && (s = !1), s || (r += n);
        }
        return e && r.length === 0 && (r = '0'), r;
    }
    function $u(t) {
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
                    let l = Qr(n);
                    if (l !== void 0) s.push(l);
                    else return (r.error = !0), !1;
                }
                n.length = 0;
            }
            return !0;
        }
        for (let l = 0; l < t.length; l++) {
            let u = t[l];
            if (!(u === '[' || u === ']'))
                if (u === ':') {
                    if ((a === !0 && (i = !0), !c())) break;
                    if ((e++, s.push(':'), e > 7)) {
                        r.error = !0;
                        break;
                    }
                    l - 1 >= 0 && t[l - 1] === ':' && (a = !0);
                    continue;
                } else if (u === '%') {
                    if (!c()) break;
                    o = !0;
                } else {
                    n.push(u);
                    continue;
                }
        }
        return (
            n.length && (o ? (r.zone = n.join('')) : i ? s.push(n.join('')) : s.push(Qr(n))),
            (r.address = s.join('')),
            r
        );
    }
    function mo(t, e = {}) {
        if (yo(t, ':') < 2) return { host: t, isIPV6: !1 };
        let r = $u(t);
        if (r.error) return { host: t, isIPV6: !1 };
        {
            let s = r.address,
                n = r.address;
            return r.zone && ((s += `%${r.zone}`), (n += `%25${r.zone}`)), { host: s, escapedHost: n, isIPV6: !0 };
        }
    }
    function vu(t, e) {
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
    function yo(t, e) {
        let r = 0;
        for (let s = 0; s < t.length; s++) t[s] === e && r++;
        return r;
    }
    var lo = /^\.\.?\//u,
        fo = /^\/\.(?:\/|$)/u,
        ho = /^\/\.\.(?:\/|$)/u,
        wu = /^\/?(?:.|\n)*?(?=\/|$)/u;
    function Eu(t) {
        let e = [];
        for (; t.length; )
            if (t.match(lo)) t = t.replace(lo, '');
            else if (t.match(fo)) t = t.replace(fo, '/');
            else if (t.match(ho)) (t = t.replace(ho, '/')), e.pop();
            else if (t === '.' || t === '..') t = '';
            else {
                let r = t.match(wu);
                if (r) {
                    let s = r[0];
                    (t = t.slice(s.length)), e.push(s);
                } else throw new Error('Unexpected dot segment condition');
            }
        return e.join('');
    }
    function bu(t, e) {
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
    function Pu(t, e) {
        let r = [];
        if ((t.userinfo !== void 0 && (r.push(t.userinfo), r.push('@')), t.host !== void 0)) {
            let s = unescape(t.host),
                n = po(s);
            if (n.isIPV4) s = n.host;
            else {
                let o = mo(n.host, { isIPV4: !1 });
                o.isIPV6 === !0 ? (s = `[${o.escapedHost}]`) : (s = t.host);
            }
            r.push(s);
        }
        return (
            (typeof t.port == 'number' || typeof t.port == 'string') && (r.push(':'), r.push(String(t.port))),
            r.length ? r.join('') : void 0
        );
    }
    go.exports = {
        recomposeAuthority: Pu,
        normalizeComponentEncoding: bu,
        removeDotSegments: Eu,
        normalizeIPv4: po,
        normalizeIPv6: mo,
        stringArrayToHexStripped: Qr,
    };
});
var Po = g((zh, bo) => {
    'use strict';
    var Su = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu,
        Nu = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    function $o(t) {
        return typeof t.secure == 'boolean' ? t.secure : String(t.scheme).toLowerCase() === 'wss';
    }
    function vo(t) {
        return t.host || (t.error = t.error || 'HTTP URIs must have a host.'), t;
    }
    function wo(t) {
        let e = String(t.scheme).toLowerCase() === 'https';
        return (t.port === (e ? 443 : 80) || t.port === '') && (t.port = void 0), t.path || (t.path = '/'), t;
    }
    function Ru(t) {
        return (
            (t.secure = $o(t)),
            (t.resourceName = (t.path || '/') + (t.query ? `?${t.query}` : '')),
            (t.path = void 0),
            (t.query = void 0),
            t
        );
    }
    function Iu(t) {
        if (
            ((t.port === ($o(t) ? 443 : 80) || t.port === '') && (t.port = void 0),
            typeof t.secure == 'boolean' && ((t.scheme = t.secure ? 'wss' : 'ws'), (t.secure = void 0)),
            t.resourceName)
        ) {
            let [e, r] = t.resourceName.split('?');
            (t.path = e && e !== '/' ? e : void 0), (t.query = r), (t.resourceName = void 0);
        }
        return (t.fragment = void 0), t;
    }
    function Ou(t, e) {
        if (!t.path) return (t.error = 'URN can not be parsed'), t;
        let r = t.path.match(Nu);
        if (r) {
            let s = e.scheme || t.scheme || 'urn';
            (t.nid = r[1].toLowerCase()), (t.nss = r[2]);
            let n = `${s}:${e.nid || t.nid}`,
                o = Xr[n];
            (t.path = void 0), o && (t = o.parse(t, e));
        } else t.error = t.error || 'URN can not be parsed.';
        return t;
    }
    function ku(t, e) {
        let r = e.scheme || t.scheme || 'urn',
            s = t.nid.toLowerCase(),
            n = `${r}:${e.nid || s}`,
            o = Xr[n];
        o && (t = o.serialize(t, e));
        let a = t,
            i = t.nss;
        return (a.path = `${s || e.nid}:${i}`), (e.skipEscape = !0), a;
    }
    function Tu(t, e) {
        let r = t;
        return (
            (r.uuid = r.nss),
            (r.nss = void 0),
            !e.tolerant && (!r.uuid || !Su.test(r.uuid)) && (r.error = r.error || 'UUID is not valid.'),
            r
        );
    }
    function qu(t) {
        let e = t;
        return (e.nss = (t.uuid || '').toLowerCase()), e;
    }
    var Eo = { scheme: 'http', domainHost: !0, parse: vo, serialize: wo },
        Cu = { scheme: 'https', domainHost: Eo.domainHost, parse: vo, serialize: wo },
        xt = { scheme: 'ws', domainHost: !0, parse: Ru, serialize: Iu },
        Au = { scheme: 'wss', domainHost: xt.domainHost, parse: xt.parse, serialize: xt.serialize },
        ju = { scheme: 'urn', parse: Ou, serialize: ku, skipNormalize: !0 },
        Mu = { scheme: 'urn:uuid', parse: Tu, serialize: qu, skipNormalize: !0 },
        Xr = { http: Eo, https: Cu, ws: xt, wss: Au, urn: ju, 'urn:uuid': Mu };
    bo.exports = Xr;
});
var No = g((Lh, Lt) => {
    'use strict';
    var {
            normalizeIPv6: Du,
            normalizeIPv4: Uu,
            removeDotSegments: dt,
            recomposeAuthority: Vu,
            normalizeComponentEncoding: zt,
        } = _o(),
        Yr = Po();
    function xu(t, e) {
        return typeof t == 'string' ? (t = ce(me(t, e), e)) : typeof t == 'object' && (t = me(ce(t, e), e)), t;
    }
    function zu(t, e, r) {
        let s = Object.assign({ scheme: 'null' }, r),
            n = So(me(t, s), me(e, s), s, !0);
        return ce(n, { ...s, skipEscape: !0 });
    }
    function So(t, e, r, s) {
        let n = {};
        return (
            s || ((t = me(ce(t, r), r)), (e = me(ce(e, r), r))),
            (r = r || {}),
            !r.tolerant && e.scheme
                ? ((n.scheme = e.scheme),
                  (n.userinfo = e.userinfo),
                  (n.host = e.host),
                  (n.port = e.port),
                  (n.path = dt(e.path || '')),
                  (n.query = e.query))
                : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0
                      ? ((n.userinfo = e.userinfo),
                        (n.host = e.host),
                        (n.port = e.port),
                        (n.path = dt(e.path || '')),
                        (n.query = e.query))
                      : (e.path
                            ? (e.path.charAt(0) === '/'
                                  ? (n.path = dt(e.path))
                                  : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path
                                        ? (n.path = `/${e.path}`)
                                        : t.path
                                          ? (n.path = t.path.slice(0, t.path.lastIndexOf('/') + 1) + e.path)
                                          : (n.path = e.path),
                                    (n.path = dt(n.path))),
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
    function Lu(t, e, r) {
        return (
            typeof t == 'string'
                ? ((t = unescape(t)), (t = ce(zt(me(t, r), !0), { ...r, skipEscape: !0 })))
                : typeof t == 'object' && (t = ce(zt(t, !0), { ...r, skipEscape: !0 })),
            typeof e == 'string'
                ? ((e = unescape(e)), (e = ce(zt(me(e, r), !0), { ...r, skipEscape: !0 })))
                : typeof e == 'object' && (e = ce(zt(e, !0), { ...r, skipEscape: !0 })),
            t.toLowerCase() === e.toLowerCase()
        );
    }
    function ce(t, e) {
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
            o = Yr[(s.scheme || r.scheme || '').toLowerCase()];
        o && o.serialize && o.serialize(r, s),
            r.path !== void 0 &&
                (s.skipEscape
                    ? (r.path = unescape(r.path))
                    : ((r.path = escape(r.path)), r.scheme !== void 0 && (r.path = r.path.split('%3A').join(':')))),
            s.reference !== 'suffix' && r.scheme && (n.push(r.scheme), n.push(':'));
        let a = Vu(r, s);
        if (
            (a !== void 0 &&
                (s.reference !== 'suffix' && n.push('//'),
                n.push(a),
                r.path && r.path.charAt(0) !== '/' && n.push('/')),
            r.path !== void 0)
        ) {
            let i = r.path;
            !s.absolutePath && (!o || !o.absolutePath) && (i = dt(i)),
                a === void 0 && (i = i.replace(/^\/\//u, '/%2F')),
                n.push(i);
        }
        return (
            r.query !== void 0 && (n.push('?'), n.push(r.query)),
            r.fragment !== void 0 && (n.push('#'), n.push(r.fragment)),
            n.join('')
        );
    }
    var Fu = Array.from({ length: 127 }, (t, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
    function Ku(t) {
        let e = 0;
        for (let r = 0, s = t.length; r < s; ++r) if (((e = t.charCodeAt(r)), e > 126 || Fu[e])) return !0;
        return !1;
    }
    var Hu =
        /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function me(t, e) {
        let r = Object.assign({}, e),
            s = { scheme: void 0, userinfo: void 0, host: '', port: void 0, path: '', query: void 0, fragment: void 0 },
            n = t.indexOf('%') !== -1,
            o = !1;
        r.reference === 'suffix' && (t = `${r.scheme ? `${r.scheme}:` : ''}//${t}`);
        let a = t.match(Hu);
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
                let c = Uu(s.host);
                if (c.isIPV4 === !1) {
                    let l = Du(c.host, { isIPV4: !1 });
                    (s.host = l.host.toLowerCase()), (o = l.isIPV6);
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
            let i = Yr[(r.scheme || s.scheme || '').toLowerCase()];
            if (
                !r.unicodeSupport &&
                (!i || !i.unicodeSupport) &&
                s.host &&
                (r.domainHost || (i && i.domainHost)) &&
                o === !1 &&
                Ku(s.host)
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
    var Zr = { SCHEMES: Yr, normalize: xu, resolve: zu, resolveComponents: So, equal: Lu, serialize: ce, parse: me };
    Lt.exports = Zr;
    Lt.exports.default = Zr;
    Lt.exports.fastUri = Zr;
});
var Io = g((es) => {
    'use strict';
    Object.defineProperty(es, '__esModule', { value: !0 });
    var Ro = No();
    Ro.code = 'require("ajv/dist/runtime/uri").default';
    es.default = Ro;
});
var Mo = g((V) => {
    'use strict';
    Object.defineProperty(V, '__esModule', { value: !0 });
    V.CodeGen = V.Name = V.nil = V.stringify = V.str = V._ = V.KeywordCxt = void 0;
    var Gu = ut();
    Object.defineProperty(V, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return Gu.KeywordCxt;
        },
    });
    var Fe = P();
    Object.defineProperty(V, '_', {
        enumerable: !0,
        get: function () {
            return Fe._;
        },
    });
    Object.defineProperty(V, 'str', {
        enumerable: !0,
        get: function () {
            return Fe.str;
        },
    });
    Object.defineProperty(V, 'stringify', {
        enumerable: !0,
        get: function () {
            return Fe.stringify;
        },
    });
    Object.defineProperty(V, 'nil', {
        enumerable: !0,
        get: function () {
            return Fe.nil;
        },
    });
    Object.defineProperty(V, 'Name', {
        enumerable: !0,
        get: function () {
            return Fe.Name;
        },
    });
    Object.defineProperty(V, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return Fe.CodeGen;
        },
    });
    var Ju = Dt(),
        Co = lt(),
        Wu = kr(),
        ft = Vt(),
        Bu = P(),
        ht = at(),
        Ft = ot(),
        rs = T(),
        Oo = io(),
        Qu = Io(),
        Ao = (t, e) => new RegExp(t, e);
    Ao.code = 'new RegExp';
    var Xu = ['removeAdditional', 'useDefaults', 'coerceTypes'],
        Yu = new Set([
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
        Zu = {
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
        el = {
            ignoreKeywordsWithRef: '',
            jsPropertySyntax: '',
            unicode: '"minLength"/"maxLength" account for unicode characters by default.',
        },
        ko = 200;
    function tl(t) {
        var e, r, s, n, o, a, i, c, l, u, d, y, m, h, f, p, _, I, N, A, w, ne, le, or, ar;
        let Be = t.strict,
            ir = (e = t.code) === null || e === void 0 ? void 0 : e.optimize,
            Gs = ir === !0 || ir === void 0 ? 1 : ir || 0,
            Js = (s = (r = t.code) === null || r === void 0 ? void 0 : r.regExp) !== null && s !== void 0 ? s : Ao,
            Ga = (n = t.uriResolver) !== null && n !== void 0 ? n : Qu.default;
        return {
            strictSchema:
                (a = (o = t.strictSchema) !== null && o !== void 0 ? o : Be) !== null && a !== void 0 ? a : !0,
            strictNumbers:
                (c = (i = t.strictNumbers) !== null && i !== void 0 ? i : Be) !== null && c !== void 0 ? c : !0,
            strictTypes:
                (u = (l = t.strictTypes) !== null && l !== void 0 ? l : Be) !== null && u !== void 0 ? u : 'log',
            strictTuples:
                (y = (d = t.strictTuples) !== null && d !== void 0 ? d : Be) !== null && y !== void 0 ? y : 'log',
            strictRequired:
                (h = (m = t.strictRequired) !== null && m !== void 0 ? m : Be) !== null && h !== void 0 ? h : !1,
            code: t.code ? { ...t.code, optimize: Gs, regExp: Js } : { optimize: Gs, regExp: Js },
            loopRequired: (f = t.loopRequired) !== null && f !== void 0 ? f : ko,
            loopEnum: (p = t.loopEnum) !== null && p !== void 0 ? p : ko,
            meta: (_ = t.meta) !== null && _ !== void 0 ? _ : !0,
            messages: (I = t.messages) !== null && I !== void 0 ? I : !0,
            inlineRefs: (N = t.inlineRefs) !== null && N !== void 0 ? N : !0,
            schemaId: (A = t.schemaId) !== null && A !== void 0 ? A : '$id',
            addUsedSchema: (w = t.addUsedSchema) !== null && w !== void 0 ? w : !0,
            validateSchema: (ne = t.validateSchema) !== null && ne !== void 0 ? ne : !0,
            validateFormats: (le = t.validateFormats) !== null && le !== void 0 ? le : !0,
            unicodeRegExp: (or = t.unicodeRegExp) !== null && or !== void 0 ? or : !0,
            int32range: (ar = t.int32range) !== null && ar !== void 0 ? ar : !0,
            uriResolver: Ga,
        };
    }
    var pt = class {
        constructor(e = {}) {
            (this.schemas = {}),
                (this.refs = {}),
                (this.formats = {}),
                (this._compilations = new Set()),
                (this._loading = {}),
                (this._cache = new Map()),
                (e = this.opts = { ...e, ...tl(e) });
            let { es5: r, lines: s } = this.opts.code;
            (this.scope = new Bu.ValueScope({ scope: {}, prefixes: Yu, es5: r, lines: s })),
                (this.logger = il(e.logger));
            let n = e.validateFormats;
            (e.validateFormats = !1),
                (this.RULES = (0, Wu.getRules)()),
                To.call(this, Zu, e, 'NOT SUPPORTED'),
                To.call(this, el, e, 'DEPRECATED', 'warn'),
                (this._metaOpts = ol.call(this)),
                e.formats && sl.call(this),
                this._addVocabularies(),
                this._addDefaultMetaSchema(),
                e.keywords && nl.call(this, e.keywords),
                typeof e.meta == 'object' && this.addMetaSchema(e.meta),
                rl.call(this),
                (e.validateFormats = n);
        }
        _addVocabularies() {
            this.addKeyword('$async');
        }
        _addDefaultMetaSchema() {
            let { $data: e, meta: r, schemaId: s } = this.opts,
                n = Oo;
            s === 'id' && ((n = { ...Oo }), (n.id = n.$id), delete n.$id), r && e && this.addMetaSchema(n, n[s], !1);
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
            async function n(u, d) {
                await o.call(this, u.$schema);
                let y = this._addSchema(u, d);
                return y.validate || a.call(this, y);
            }
            async function o(u) {
                u && !this.getSchema(u) && (await n.call(this, { $ref: u }, !0));
            }
            async function a(u) {
                try {
                    return this._compileSchemaEnv(u);
                } catch (d) {
                    if (!(d instanceof Co.default)) throw d;
                    return i.call(this, d), await c.call(this, d.missingSchema), a.call(this, u);
                }
            }
            function i({ missingSchema: u, missingRef: d }) {
                if (this.refs[u]) throw new Error(`AnySchema ${u} is loaded but ${d} cannot be resolved`);
            }
            async function c(u) {
                let d = await l.call(this, u);
                this.refs[u] || (await o.call(this, d.$schema)), this.refs[u] || this.addSchema(d, u, r);
            }
            async function l(u) {
                let d = this._loading[u];
                if (d) return d;
                try {
                    return await (this._loading[u] = s(u));
                } finally {
                    delete this._loading[u];
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
                (r = (0, ht.normalizeId)(r || o)),
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
            for (; typeof (r = qo.call(this, e)) == 'string'; ) e = r;
            if (r === void 0) {
                let { schemaId: s } = this.opts,
                    n = new ft.SchemaEnv({ schema: {}, schemaId: s });
                if (((r = ft.resolveSchema.call(this, n, e)), !r)) return;
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
                    let r = qo.call(this, e);
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
                    return s && ((s = (0, ht.normalizeId)(s)), delete this.schemas[s], delete this.refs[s]), this;
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
            if ((ul.call(this, s, r), !r)) return (0, rs.eachItem)(s, (o) => ts.call(this, o)), this;
            dl.call(this, r);
            let n = { ...r, type: (0, Ft.getJSONTypes)(r.type), schemaType: (0, Ft.getJSONTypes)(r.schemaType) };
            return (
                (0, rs.eachItem)(
                    s,
                    n.type.length === 0
                        ? (o) => ts.call(this, o, n)
                        : (o) => n.type.forEach((a) => ts.call(this, o, n, a)),
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
                    let { $data: l } = c.definition,
                        u = a[i];
                    l && u && (a[i] = jo(u));
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
            s = (0, ht.normalizeId)(a || s);
            let l = ht.getSchemaRefs.call(this, e, s);
            return (
                (c = new ft.SchemaEnv({ schema: e, schemaId: i, meta: r, baseId: s, localRefs: l })),
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
            if ((e.meta ? this._compileMetaSchema(e) : ft.compileSchema.call(this, e), !e.validate))
                throw new Error('ajv implementation error');
            return e.validate;
        }
        _compileMetaSchema(e) {
            let r = this.opts;
            this.opts = this._metaOpts;
            try {
                ft.compileSchema.call(this, e);
            } finally {
                this.opts = r;
            }
        }
    };
    pt.ValidationError = Ju.default;
    pt.MissingRefError = Co.default;
    V.default = pt;
    function To(t, e, r, s = 'error') {
        for (let n in t) {
            let o = n;
            o in e && this.logger[s](`${r}: option ${n}. ${t[o]}`);
        }
    }
    function qo(t) {
        return (t = (0, ht.normalizeId)(t)), this.schemas[t] || this.refs[t];
    }
    function rl() {
        let t = this.opts.schemas;
        if (t)
            if (Array.isArray(t)) this.addSchema(t);
            else for (let e in t) this.addSchema(t[e], e);
    }
    function sl() {
        for (let t in this.opts.formats) {
            let e = this.opts.formats[t];
            e && this.addFormat(t, e);
        }
    }
    function nl(t) {
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
    function ol() {
        let t = { ...this.opts };
        for (let e of Xu) delete t[e];
        return t;
    }
    var al = { log() {}, warn() {}, error() {} };
    function il(t) {
        if (t === !1) return al;
        if (t === void 0) return console;
        if (t.log && t.warn && t.error) return t;
        throw new Error('logger must implement log, warn and error methods');
    }
    var cl = /^[a-z_$][a-z0-9_$:-]*$/i;
    function ul(t, e) {
        let { RULES: r } = this;
        if (
            ((0, rs.eachItem)(t, (s) => {
                if (r.keywords[s]) throw new Error(`Keyword ${s} is already defined`);
                if (!cl.test(s)) throw new Error(`Keyword ${s} has invalid name`);
            }),
            !!e && e.$data && !('code' in e || 'validate' in e))
        )
            throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ts(t, e, r) {
        var s;
        let n = e?.post;
        if (r && n) throw new Error('keyword with "post" flag cannot have "type"');
        let { RULES: o } = this,
            a = n ? o.post : o.rules.find(({ type: c }) => c === r);
        if ((a || ((a = { type: r, rules: [] }), o.rules.push(a)), (o.keywords[t] = !0), !e)) return;
        let i = {
            keyword: t,
            definition: { ...e, type: (0, Ft.getJSONTypes)(e.type), schemaType: (0, Ft.getJSONTypes)(e.schemaType) },
        };
        e.before ? ll.call(this, a, i, e.before) : a.rules.push(i),
            (o.all[t] = i),
            (s = e.implements) === null || s === void 0 || s.forEach((c) => this.addKeyword(c));
    }
    function ll(t, e, r) {
        let s = t.rules.findIndex((n) => n.keyword === r);
        s >= 0 ? t.rules.splice(s, 0, e) : (t.rules.push(e), this.logger.warn(`rule ${r} is not defined`));
    }
    function dl(t) {
        let { metaSchema: e } = t;
        e !== void 0 && (t.$data && this.opts.$data && (e = jo(e)), (t.validateSchema = this.compile(e, !0)));
    }
    var fl = { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' };
    function jo(t) {
        return { anyOf: [t, fl] };
    }
});
var Do = g((ss) => {
    'use strict';
    Object.defineProperty(ss, '__esModule', { value: !0 });
    var hl = {
        keyword: 'id',
        code() {
            throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
        },
    };
    ss.default = hl;
});
var zo = g((Te) => {
    'use strict';
    Object.defineProperty(Te, '__esModule', { value: !0 });
    Te.callRef = Te.getValidate = void 0;
    var pl = lt(),
        Uo = X(),
        B = P(),
        Ke = he(),
        Vo = Vt(),
        Kt = T(),
        ml = {
            keyword: '$ref',
            schemaType: 'string',
            code(t) {
                let { gen: e, schema: r, it: s } = t,
                    { baseId: n, schemaEnv: o, validateName: a, opts: i, self: c } = s,
                    { root: l } = o;
                if ((r === '#' || r === '#/') && n === l.baseId) return d();
                let u = Vo.resolveRef.call(c, l, n, r);
                if (u === void 0) throw new pl.default(s.opts.uriResolver, n, r);
                if (u instanceof Vo.SchemaEnv) return y(u);
                return m(u);
                function d() {
                    if (o === l) return Ht(t, a, o, o.$async);
                    let h = e.scopeValue('root', { ref: l });
                    return Ht(t, (0, B._)`${h}.validate`, l, l.$async);
                }
                function y(h) {
                    let f = xo(t, h);
                    Ht(t, f, h, h.$async);
                }
                function m(h) {
                    let f = e.scopeValue(
                            'schema',
                            i.code.source === !0 ? { ref: h, code: (0, B.stringify)(h) } : { ref: h },
                        ),
                        p = e.name('valid'),
                        _ = t.subschema(
                            { schema: h, dataTypes: [], schemaPath: B.nil, topSchemaRef: f, errSchemaPath: r },
                            p,
                        );
                    t.mergeEvaluated(_), t.ok(p);
                }
            },
        };
    function xo(t, e) {
        let { gen: r } = t;
        return e.validate
            ? r.scopeValue('validate', { ref: e.validate })
            : (0, B._)`${r.scopeValue('wrapper', { ref: e })}.validate`;
    }
    Te.getValidate = xo;
    function Ht(t, e, r, s) {
        let { gen: n, it: o } = t,
            { allErrors: a, schemaEnv: i, opts: c } = o,
            l = c.passContext ? Ke.default.this : B.nil;
        s ? u() : d();
        function u() {
            if (!i.$async) throw new Error('async schema referenced by sync schema');
            let h = n.let('valid');
            n.try(
                () => {
                    n.code((0, B._)`await ${(0, Uo.callValidateCode)(t, e, l)}`), m(e), a || n.assign(h, !0);
                },
                (f) => {
                    n.if((0, B._)`!(${f} instanceof ${o.ValidationError})`, () => n.throw(f)),
                        y(f),
                        a || n.assign(h, !1);
                },
            ),
                t.ok(h);
        }
        function d() {
            t.result(
                (0, Uo.callValidateCode)(t, e, l),
                () => m(e),
                () => y(e),
            );
        }
        function y(h) {
            let f = (0, B._)`${h}.errors`;
            n.assign(
                Ke.default.vErrors,
                (0, B._)`${Ke.default.vErrors} === null ? ${f} : ${Ke.default.vErrors}.concat(${f})`,
            ),
                n.assign(Ke.default.errors, (0, B._)`${Ke.default.vErrors}.length`);
        }
        function m(h) {
            var f;
            if (!o.opts.unevaluated) return;
            let p = (f = r?.validate) === null || f === void 0 ? void 0 : f.evaluated;
            if (o.props !== !0)
                if (p && !p.dynamicProps)
                    p.props !== void 0 && (o.props = Kt.mergeEvaluated.props(n, p.props, o.props));
                else {
                    let _ = n.var('props', (0, B._)`${h}.evaluated.props`);
                    o.props = Kt.mergeEvaluated.props(n, _, o.props, B.Name);
                }
            if (o.items !== !0)
                if (p && !p.dynamicItems)
                    p.items !== void 0 && (o.items = Kt.mergeEvaluated.items(n, p.items, o.items));
                else {
                    let _ = n.var('items', (0, B._)`${h}.evaluated.items`);
                    o.items = Kt.mergeEvaluated.items(n, _, o.items, B.Name);
                }
        }
    }
    Te.callRef = Ht;
    Te.default = ml;
});
var Lo = g((ns) => {
    'use strict';
    Object.defineProperty(ns, '__esModule', { value: !0 });
    var yl = Do(),
        gl = zo(),
        _l = ['$schema', '$id', '$defs', '$vocabulary', { keyword: '$comment' }, 'definitions', yl.default, gl.default];
    ns.default = _l;
});
var Fo = g((os) => {
    'use strict';
    Object.defineProperty(os, '__esModule', { value: !0 });
    var Gt = P(),
        be = Gt.operators,
        Jt = {
            maximum: { okStr: '<=', ok: be.LTE, fail: be.GT },
            minimum: { okStr: '>=', ok: be.GTE, fail: be.LT },
            exclusiveMaximum: { okStr: '<', ok: be.LT, fail: be.GTE },
            exclusiveMinimum: { okStr: '>', ok: be.GT, fail: be.LTE },
        },
        $l = {
            message: ({ keyword: t, schemaCode: e }) => (0, Gt.str)`must be ${Jt[t].okStr} ${e}`,
            params: ({ keyword: t, schemaCode: e }) => (0, Gt._)`{comparison: ${Jt[t].okStr}, limit: ${e}}`,
        },
        vl = {
            keyword: Object.keys(Jt),
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: $l,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t;
                t.fail$data((0, Gt._)`${r} ${Jt[e].fail} ${s} || isNaN(${r})`);
            },
        };
    os.default = vl;
});
var Ko = g((as) => {
    'use strict';
    Object.defineProperty(as, '__esModule', { value: !0 });
    var mt = P(),
        wl = {
            message: ({ schemaCode: t }) => (0, mt.str)`must be multiple of ${t}`,
            params: ({ schemaCode: t }) => (0, mt._)`{multipleOf: ${t}}`,
        },
        El = {
            keyword: 'multipleOf',
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: wl,
            code(t) {
                let { gen: e, data: r, schemaCode: s, it: n } = t,
                    o = n.opts.multipleOfPrecision,
                    a = e.let('res'),
                    i = o ? (0, mt._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, mt._)`${a} !== parseInt(${a})`;
                t.fail$data((0, mt._)`(${s} === 0 || (${a} = ${r}/${s}, ${i}))`);
            },
        };
    as.default = El;
});
var Go = g((is) => {
    'use strict';
    Object.defineProperty(is, '__esModule', { value: !0 });
    function Ho(t) {
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
    is.default = Ho;
    Ho.code = 'require("ajv/dist/runtime/ucs2length").default';
});
var Jo = g((cs) => {
    'use strict';
    Object.defineProperty(cs, '__esModule', { value: !0 });
    var qe = P(),
        bl = T(),
        Pl = Go(),
        Sl = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxLength' ? 'more' : 'fewer';
                return (0, qe.str)`must NOT have ${r} than ${e} characters`;
            },
            params: ({ schemaCode: t }) => (0, qe._)`{limit: ${t}}`,
        },
        Nl = {
            keyword: ['maxLength', 'minLength'],
            type: 'string',
            schemaType: 'number',
            $data: !0,
            error: Sl,
            code(t) {
                let { keyword: e, data: r, schemaCode: s, it: n } = t,
                    o = e === 'maxLength' ? qe.operators.GT : qe.operators.LT,
                    a =
                        n.opts.unicode === !1
                            ? (0, qe._)`${r}.length`
                            : (0, qe._)`${(0, bl.useFunc)(t.gen, Pl.default)}(${r})`;
                t.fail$data((0, qe._)`${a} ${o} ${s}`);
            },
        };
    cs.default = Nl;
});
var Wo = g((us) => {
    'use strict';
    Object.defineProperty(us, '__esModule', { value: !0 });
    var Rl = X(),
        Wt = P(),
        Il = {
            message: ({ schemaCode: t }) => (0, Wt.str)`must match pattern "${t}"`,
            params: ({ schemaCode: t }) => (0, Wt._)`{pattern: ${t}}`,
        },
        Ol = {
            keyword: 'pattern',
            type: 'string',
            schemaType: 'string',
            $data: !0,
            error: Il,
            code(t) {
                let { data: e, $data: r, schema: s, schemaCode: n, it: o } = t,
                    a = o.opts.unicodeRegExp ? 'u' : '',
                    i = r ? (0, Wt._)`(new RegExp(${n}, ${a}))` : (0, Rl.usePattern)(t, s);
                t.fail$data((0, Wt._)`!${i}.test(${e})`);
            },
        };
    us.default = Ol;
});
var Bo = g((ls) => {
    'use strict';
    Object.defineProperty(ls, '__esModule', { value: !0 });
    var yt = P(),
        kl = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxProperties' ? 'more' : 'fewer';
                return (0, yt.str)`must NOT have ${r} than ${e} properties`;
            },
            params: ({ schemaCode: t }) => (0, yt._)`{limit: ${t}}`,
        },
        Tl = {
            keyword: ['maxProperties', 'minProperties'],
            type: 'object',
            schemaType: 'number',
            $data: !0,
            error: kl,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxProperties' ? yt.operators.GT : yt.operators.LT;
                t.fail$data((0, yt._)`Object.keys(${r}).length ${n} ${s}`);
            },
        };
    ls.default = Tl;
});
var Qo = g((ds) => {
    'use strict';
    Object.defineProperty(ds, '__esModule', { value: !0 });
    var gt = X(),
        _t = P(),
        ql = T(),
        Cl = {
            message: ({ params: { missingProperty: t } }) => (0, _t.str)`must have required property '${t}'`,
            params: ({ params: { missingProperty: t } }) => (0, _t._)`{missingProperty: ${t}}`,
        },
        Al = {
            keyword: 'required',
            type: 'object',
            schemaType: 'array',
            $data: !0,
            error: Cl,
            code(t) {
                let { gen: e, schema: r, schemaCode: s, data: n, $data: o, it: a } = t,
                    { opts: i } = a;
                if (!o && r.length === 0) return;
                let c = r.length >= i.loopRequired;
                if ((a.allErrors ? l() : u(), i.strictRequired)) {
                    let m = t.parentSchema.properties,
                        { definedProperties: h } = t.it;
                    for (let f of r)
                        if (m?.[f] === void 0 && !h.has(f)) {
                            let p = a.schemaEnv.baseId + a.errSchemaPath,
                                _ = `required property "${f}" is not defined at "${p}" (strictRequired)`;
                            (0, ql.checkStrictMode)(a, _, a.opts.strictRequired);
                        }
                }
                function l() {
                    if (c || o) t.block$data(_t.nil, d);
                    else for (let m of r) (0, gt.checkReportMissingProp)(t, m);
                }
                function u() {
                    let m = e.let('missing');
                    if (c || o) {
                        let h = e.let('valid', !0);
                        t.block$data(h, () => y(m, h)), t.ok(h);
                    } else e.if((0, gt.checkMissingProp)(t, r, m)), (0, gt.reportMissingProp)(t, m), e.else();
                }
                function d() {
                    e.forOf('prop', s, (m) => {
                        t.setParams({ missingProperty: m }),
                            e.if((0, gt.noPropertyInData)(e, n, m, i.ownProperties), () => t.error());
                    });
                }
                function y(m, h) {
                    t.setParams({ missingProperty: m }),
                        e.forOf(
                            m,
                            s,
                            () => {
                                e.assign(h, (0, gt.propertyInData)(e, n, m, i.ownProperties)),
                                    e.if((0, _t.not)(h), () => {
                                        t.error(), e.break();
                                    });
                            },
                            _t.nil,
                        );
                }
            },
        };
    ds.default = Al;
});
var Xo = g((fs) => {
    'use strict';
    Object.defineProperty(fs, '__esModule', { value: !0 });
    var $t = P(),
        jl = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxItems' ? 'more' : 'fewer';
                return (0, $t.str)`must NOT have ${r} than ${e} items`;
            },
            params: ({ schemaCode: t }) => (0, $t._)`{limit: ${t}}`,
        },
        Ml = {
            keyword: ['maxItems', 'minItems'],
            type: 'array',
            schemaType: 'number',
            $data: !0,
            error: jl,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxItems' ? $t.operators.GT : $t.operators.LT;
                t.fail$data((0, $t._)`${r}.length ${n} ${s}`);
            },
        };
    fs.default = Ml;
});
var Bt = g((hs) => {
    'use strict';
    Object.defineProperty(hs, '__esModule', { value: !0 });
    var Yo = Ur();
    Yo.code = 'require("ajv/dist/runtime/equal").default';
    hs.default = Yo;
});
var Zo = g((ms) => {
    'use strict';
    Object.defineProperty(ms, '__esModule', { value: !0 });
    var ps = ot(),
        x = P(),
        Dl = T(),
        Ul = Bt(),
        Vl = {
            message: ({ params: { i: t, j: e } }) =>
                (0, x.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
            params: ({ params: { i: t, j: e } }) => (0, x._)`{i: ${t}, j: ${e}}`,
        },
        xl = {
            keyword: 'uniqueItems',
            type: 'array',
            schemaType: 'boolean',
            $data: !0,
            error: Vl,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, parentSchema: o, schemaCode: a, it: i } = t;
                if (!s && !n) return;
                let c = e.let('valid'),
                    l = o.items ? (0, ps.getSchemaTypes)(o.items) : [];
                t.block$data(c, u, (0, x._)`${a} === false`), t.ok(c);
                function u() {
                    let h = e.let('i', (0, x._)`${r}.length`),
                        f = e.let('j');
                    t.setParams({ i: h, j: f }), e.assign(c, !0), e.if((0, x._)`${h} > 1`, () => (d() ? y : m)(h, f));
                }
                function d() {
                    return l.length > 0 && !l.some((h) => h === 'object' || h === 'array');
                }
                function y(h, f) {
                    let p = e.name('item'),
                        _ = (0, ps.checkDataTypes)(l, p, i.opts.strictNumbers, ps.DataType.Wrong),
                        I = e.const('indices', (0, x._)`{}`);
                    e.for((0, x._)`;${h}--;`, () => {
                        e.let(p, (0, x._)`${r}[${h}]`),
                            e.if(_, (0, x._)`continue`),
                            l.length > 1 && e.if((0, x._)`typeof ${p} == "string"`, (0, x._)`${p} += "_"`),
                            e
                                .if((0, x._)`typeof ${I}[${p}] == "number"`, () => {
                                    e.assign(f, (0, x._)`${I}[${p}]`), t.error(), e.assign(c, !1).break();
                                })
                                .code((0, x._)`${I}[${p}] = ${h}`);
                    });
                }
                function m(h, f) {
                    let p = (0, Dl.useFunc)(e, Ul.default),
                        _ = e.name('outer');
                    e.label(_).for((0, x._)`;${h}--;`, () =>
                        e.for((0, x._)`${f} = ${h}; ${f}--;`, () =>
                            e.if((0, x._)`${p}(${r}[${h}], ${r}[${f}])`, () => {
                                t.error(), e.assign(c, !1).break(_);
                            }),
                        ),
                    );
                }
            },
        };
    ms.default = xl;
});
var ea = g((gs) => {
    'use strict';
    Object.defineProperty(gs, '__esModule', { value: !0 });
    var ys = P(),
        zl = T(),
        Ll = Bt(),
        Fl = { message: 'must be equal to constant', params: ({ schemaCode: t }) => (0, ys._)`{allowedValue: ${t}}` },
        Kl = {
            keyword: 'const',
            $data: !0,
            error: Fl,
            code(t) {
                let { gen: e, data: r, $data: s, schemaCode: n, schema: o } = t;
                s || (o && typeof o == 'object')
                    ? t.fail$data((0, ys._)`!${(0, zl.useFunc)(e, Ll.default)}(${r}, ${n})`)
                    : t.fail((0, ys._)`${o} !== ${r}`);
            },
        };
    gs.default = Kl;
});
var ta = g((_s) => {
    'use strict';
    Object.defineProperty(_s, '__esModule', { value: !0 });
    var vt = P(),
        Hl = T(),
        Gl = Bt(),
        Jl = {
            message: 'must be equal to one of the allowed values',
            params: ({ schemaCode: t }) => (0, vt._)`{allowedValues: ${t}}`,
        },
        Wl = {
            keyword: 'enum',
            schemaType: 'array',
            $data: !0,
            error: Jl,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, schemaCode: o, it: a } = t;
                if (!s && n.length === 0) throw new Error('enum must have non-empty array');
                let i = n.length >= a.opts.loopEnum,
                    c,
                    l = () => c ?? (c = (0, Hl.useFunc)(e, Gl.default)),
                    u;
                if (i || s) (u = e.let('valid')), t.block$data(u, d);
                else {
                    if (!Array.isArray(n)) throw new Error('ajv implementation error');
                    let m = e.const('vSchema', o);
                    u = (0, vt.or)(...n.map((h, f) => y(m, f)));
                }
                t.pass(u);
                function d() {
                    e.assign(u, !1),
                        e.forOf('v', o, (m) => e.if((0, vt._)`${l()}(${r}, ${m})`, () => e.assign(u, !0).break()));
                }
                function y(m, h) {
                    let f = n[h];
                    return typeof f == 'object' && f !== null
                        ? (0, vt._)`${l()}(${r}, ${m}[${h}])`
                        : (0, vt._)`${r} === ${f}`;
                }
            },
        };
    _s.default = Wl;
});
var ra = g(($s) => {
    'use strict';
    Object.defineProperty($s, '__esModule', { value: !0 });
    var Bl = Fo(),
        Ql = Ko(),
        Xl = Jo(),
        Yl = Wo(),
        Zl = Bo(),
        ed = Qo(),
        td = Xo(),
        rd = Zo(),
        sd = ea(),
        nd = ta(),
        od = [
            Bl.default,
            Ql.default,
            Xl.default,
            Yl.default,
            Zl.default,
            ed.default,
            td.default,
            rd.default,
            { keyword: 'type', schemaType: ['string', 'array'] },
            { keyword: 'nullable', schemaType: 'boolean' },
            sd.default,
            nd.default,
        ];
    $s.default = od;
});
var ws = g((wt) => {
    'use strict';
    Object.defineProperty(wt, '__esModule', { value: !0 });
    wt.validateAdditionalItems = void 0;
    var Ce = P(),
        vs = T(),
        ad = {
            message: ({ params: { len: t } }) => (0, Ce.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, Ce._)`{limit: ${t}}`,
        },
        id = {
            keyword: 'additionalItems',
            type: 'array',
            schemaType: ['boolean', 'object'],
            before: 'uniqueItems',
            error: ad,
            code(t) {
                let { parentSchema: e, it: r } = t,
                    { items: s } = e;
                if (!Array.isArray(s)) {
                    (0, vs.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return;
                }
                sa(t, s);
            },
        };
    function sa(t, e) {
        let { gen: r, schema: s, data: n, keyword: o, it: a } = t;
        a.items = !0;
        let i = r.const('len', (0, Ce._)`${n}.length`);
        if (s === !1) t.setParams({ len: e.length }), t.pass((0, Ce._)`${i} <= ${e.length}`);
        else if (typeof s == 'object' && !(0, vs.alwaysValidSchema)(a, s)) {
            let l = r.var('valid', (0, Ce._)`${i} <= ${e.length}`);
            r.if((0, Ce.not)(l), () => c(l)), t.ok(l);
        }
        function c(l) {
            r.forRange('i', e.length, i, (u) => {
                t.subschema({ keyword: o, dataProp: u, dataPropType: vs.Type.Num }, l),
                    a.allErrors || r.if((0, Ce.not)(l), () => r.break());
            });
        }
    }
    wt.validateAdditionalItems = sa;
    wt.default = id;
});
var Es = g((Et) => {
    'use strict';
    Object.defineProperty(Et, '__esModule', { value: !0 });
    Et.validateTuple = void 0;
    var na = P(),
        Qt = T(),
        cd = X(),
        ud = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'array', 'boolean'],
            before: 'uniqueItems',
            code(t) {
                let { schema: e, it: r } = t;
                if (Array.isArray(e)) return oa(t, 'additionalItems', e);
                (r.items = !0), !(0, Qt.alwaysValidSchema)(r, e) && t.ok((0, cd.validateArray)(t));
            },
        };
    function oa(t, e, r = t.schema) {
        let { gen: s, parentSchema: n, data: o, keyword: a, it: i } = t;
        u(n),
            i.opts.unevaluated &&
                r.length &&
                i.items !== !0 &&
                (i.items = Qt.mergeEvaluated.items(s, r.length, i.items));
        let c = s.name('valid'),
            l = s.const('len', (0, na._)`${o}.length`);
        r.forEach((d, y) => {
            (0, Qt.alwaysValidSchema)(i, d) ||
                (s.if((0, na._)`${l} > ${y}`, () => t.subschema({ keyword: a, schemaProp: y, dataProp: y }, c)),
                t.ok(c));
        });
        function u(d) {
            let { opts: y, errSchemaPath: m } = i,
                h = r.length,
                f = h === d.minItems && (h === d.maxItems || d[e] === !1);
            if (y.strictTuples && !f) {
                let p = `"${a}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${m}"`;
                (0, Qt.checkStrictMode)(i, p, y.strictTuples);
            }
        }
    }
    Et.validateTuple = oa;
    Et.default = ud;
});
var aa = g((bs) => {
    'use strict';
    Object.defineProperty(bs, '__esModule', { value: !0 });
    var ld = Es(),
        dd = {
            keyword: 'prefixItems',
            type: 'array',
            schemaType: ['array'],
            before: 'uniqueItems',
            code: (t) => (0, ld.validateTuple)(t, 'items'),
        };
    bs.default = dd;
});
var ca = g((Ps) => {
    'use strict';
    Object.defineProperty(Ps, '__esModule', { value: !0 });
    var ia = P(),
        fd = T(),
        hd = X(),
        pd = ws(),
        md = {
            message: ({ params: { len: t } }) => (0, ia.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, ia._)`{limit: ${t}}`,
        },
        yd = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            error: md,
            code(t) {
                let { schema: e, parentSchema: r, it: s } = t,
                    { prefixItems: n } = r;
                (s.items = !0),
                    !(0, fd.alwaysValidSchema)(s, e) &&
                        (n ? (0, pd.validateAdditionalItems)(t, n) : t.ok((0, hd.validateArray)(t)));
            },
        };
    Ps.default = yd;
});
var ua = g((Ss) => {
    'use strict';
    Object.defineProperty(Ss, '__esModule', { value: !0 });
    var Z = P(),
        Xt = T(),
        gd = {
            message: ({ params: { min: t, max: e } }) =>
                e === void 0
                    ? (0, Z.str)`must contain at least ${t} valid item(s)`
                    : (0, Z.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
            params: ({ params: { min: t, max: e } }) =>
                e === void 0 ? (0, Z._)`{minContains: ${t}}` : (0, Z._)`{minContains: ${t}, maxContains: ${e}}`,
        },
        _d = {
            keyword: 'contains',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            trackErrors: !0,
            error: gd,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t,
                    a,
                    i,
                    { minContains: c, maxContains: l } = s;
                o.opts.next ? ((a = c === void 0 ? 1 : c), (i = l)) : (a = 1);
                let u = e.const('len', (0, Z._)`${n}.length`);
                if ((t.setParams({ min: a, max: i }), i === void 0 && a === 0)) {
                    (0, Xt.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return;
                }
                if (i !== void 0 && a > i) {
                    (0, Xt.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), t.fail();
                    return;
                }
                if ((0, Xt.alwaysValidSchema)(o, r)) {
                    let f = (0, Z._)`${u} >= ${a}`;
                    i !== void 0 && (f = (0, Z._)`${f} && ${u} <= ${i}`), t.pass(f);
                    return;
                }
                o.items = !0;
                let d = e.name('valid');
                i === void 0 && a === 1
                    ? m(d, () => e.if(d, () => e.break()))
                    : a === 0
                      ? (e.let(d, !0), i !== void 0 && e.if((0, Z._)`${n}.length > 0`, y))
                      : (e.let(d, !1), y()),
                    t.result(d, () => t.reset());
                function y() {
                    let f = e.name('_valid'),
                        p = e.let('count', 0);
                    m(f, () => e.if(f, () => h(p)));
                }
                function m(f, p) {
                    e.forRange('i', 0, u, (_) => {
                        t.subschema(
                            { keyword: 'contains', dataProp: _, dataPropType: Xt.Type.Num, compositeRule: !0 },
                            f,
                        ),
                            p();
                    });
                }
                function h(f) {
                    e.code((0, Z._)`${f}++`),
                        i === void 0
                            ? e.if((0, Z._)`${f} >= ${a}`, () => e.assign(d, !0).break())
                            : (e.if((0, Z._)`${f} > ${i}`, () => e.assign(d, !1).break()),
                              a === 1 ? e.assign(d, !0) : e.if((0, Z._)`${f} >= ${a}`, () => e.assign(d, !0)));
                }
            },
        };
    Ss.default = _d;
});
var fa = g((ue) => {
    'use strict';
    Object.defineProperty(ue, '__esModule', { value: !0 });
    ue.validateSchemaDeps = ue.validatePropertyDeps = ue.error = void 0;
    var Ns = P(),
        $d = T(),
        bt = X();
    ue.error = {
        message: ({ params: { property: t, depsCount: e, deps: r } }) => {
            let s = e === 1 ? 'property' : 'properties';
            return (0, Ns.str)`must have ${s} ${r} when property ${t} is present`;
        },
        params: ({ params: { property: t, depsCount: e, deps: r, missingProperty: s } }) => (0, Ns._)`{property: ${t},
    missingProperty: ${s},
    depsCount: ${e},
    deps: ${r}}`,
    };
    var vd = {
        keyword: 'dependencies',
        type: 'object',
        schemaType: 'object',
        error: ue.error,
        code(t) {
            let [e, r] = wd(t);
            la(t, e), da(t, r);
        },
    };
    function wd({ schema: t }) {
        let e = {},
            r = {};
        for (let s in t) {
            if (s === '__proto__') continue;
            let n = Array.isArray(t[s]) ? e : r;
            n[s] = t[s];
        }
        return [e, r];
    }
    function la(t, e = t.schema) {
        let { gen: r, data: s, it: n } = t;
        if (Object.keys(e).length === 0) return;
        let o = r.let('missing');
        for (let a in e) {
            let i = e[a];
            if (i.length === 0) continue;
            let c = (0, bt.propertyInData)(r, s, a, n.opts.ownProperties);
            t.setParams({ property: a, depsCount: i.length, deps: i.join(', ') }),
                n.allErrors
                    ? r.if(c, () => {
                          for (let l of i) (0, bt.checkReportMissingProp)(t, l);
                      })
                    : (r.if((0, Ns._)`${c} && (${(0, bt.checkMissingProp)(t, i, o)})`),
                      (0, bt.reportMissingProp)(t, o),
                      r.else());
        }
    }
    ue.validatePropertyDeps = la;
    function da(t, e = t.schema) {
        let { gen: r, data: s, keyword: n, it: o } = t,
            a = r.name('valid');
        for (let i in e)
            (0, $d.alwaysValidSchema)(o, e[i]) ||
                (r.if(
                    (0, bt.propertyInData)(r, s, i, o.opts.ownProperties),
                    () => {
                        let c = t.subschema({ keyword: n, schemaProp: i }, a);
                        t.mergeValidEvaluated(c, a);
                    },
                    () => r.var(a, !0),
                ),
                t.ok(a));
    }
    ue.validateSchemaDeps = da;
    ue.default = vd;
});
var pa = g((Rs) => {
    'use strict';
    Object.defineProperty(Rs, '__esModule', { value: !0 });
    var ha = P(),
        Ed = T(),
        bd = {
            message: 'property name must be valid',
            params: ({ params: t }) => (0, ha._)`{propertyName: ${t.propertyName}}`,
        },
        Pd = {
            keyword: 'propertyNames',
            type: 'object',
            schemaType: ['object', 'boolean'],
            error: bd,
            code(t) {
                let { gen: e, schema: r, data: s, it: n } = t;
                if ((0, Ed.alwaysValidSchema)(n, r)) return;
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
                        e.if((0, ha.not)(o), () => {
                            t.error(!0), n.allErrors || e.break();
                        });
                }),
                    t.ok(o);
            },
        };
    Rs.default = Pd;
});
var Os = g((Is) => {
    'use strict';
    Object.defineProperty(Is, '__esModule', { value: !0 });
    var Yt = X(),
        se = P(),
        Sd = he(),
        Zt = T(),
        Nd = {
            message: 'must NOT have additional properties',
            params: ({ params: t }) => (0, se._)`{additionalProperty: ${t.additionalProperty}}`,
        },
        Rd = {
            keyword: 'additionalProperties',
            type: ['object'],
            schemaType: ['boolean', 'object'],
            allowUndefined: !0,
            trackErrors: !0,
            error: Nd,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, errsCount: o, it: a } = t;
                if (!o) throw new Error('ajv implementation error');
                let { allErrors: i, opts: c } = a;
                if (((a.props = !0), c.removeAdditional !== 'all' && (0, Zt.alwaysValidSchema)(a, r))) return;
                let l = (0, Yt.allSchemaProperties)(s.properties),
                    u = (0, Yt.allSchemaProperties)(s.patternProperties);
                d(), t.ok((0, se._)`${o} === ${Sd.default.errors}`);
                function d() {
                    e.forIn('key', n, (p) => {
                        !l.length && !u.length ? h(p) : e.if(y(p), () => h(p));
                    });
                }
                function y(p) {
                    let _;
                    if (l.length > 8) {
                        let I = (0, Zt.schemaRefOrVal)(a, s.properties, 'properties');
                        _ = (0, Yt.isOwnProperty)(e, I, p);
                    } else l.length ? (_ = (0, se.or)(...l.map((I) => (0, se._)`${p} === ${I}`))) : (_ = se.nil);
                    return (
                        u.length &&
                            (_ = (0, se.or)(_, ...u.map((I) => (0, se._)`${(0, Yt.usePattern)(t, I)}.test(${p})`))),
                        (0, se.not)(_)
                    );
                }
                function m(p) {
                    e.code((0, se._)`delete ${n}[${p}]`);
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
                    if (typeof r == 'object' && !(0, Zt.alwaysValidSchema)(a, r)) {
                        let _ = e.name('valid');
                        c.removeAdditional === 'failing'
                            ? (f(p, _, !1),
                              e.if((0, se.not)(_), () => {
                                  t.reset(), m(p);
                              }))
                            : (f(p, _), i || e.if((0, se.not)(_), () => e.break()));
                    }
                }
                function f(p, _, I) {
                    let N = { keyword: 'additionalProperties', dataProp: p, dataPropType: Zt.Type.Str };
                    I === !1 && Object.assign(N, { compositeRule: !0, createErrors: !1, allErrors: !1 }),
                        t.subschema(N, _);
                }
            },
        };
    Is.default = Rd;
});
var ga = g((Ts) => {
    'use strict';
    Object.defineProperty(Ts, '__esModule', { value: !0 });
    var Id = ut(),
        ma = X(),
        ks = T(),
        ya = Os(),
        Od = {
            keyword: 'properties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t;
                o.opts.removeAdditional === 'all' &&
                    s.additionalProperties === void 0 &&
                    ya.default.code(new Id.KeywordCxt(o, ya.default, 'additionalProperties'));
                let a = (0, ma.allSchemaProperties)(r);
                for (let d of a) o.definedProperties.add(d);
                o.opts.unevaluated &&
                    a.length &&
                    o.props !== !0 &&
                    (o.props = ks.mergeEvaluated.props(e, (0, ks.toHash)(a), o.props));
                let i = a.filter((d) => !(0, ks.alwaysValidSchema)(o, r[d]));
                if (i.length === 0) return;
                let c = e.name('valid');
                for (let d of i)
                    l(d)
                        ? u(d)
                        : (e.if((0, ma.propertyInData)(e, n, d, o.opts.ownProperties)),
                          u(d),
                          o.allErrors || e.else().var(c, !0),
                          e.endIf()),
                        t.it.definedProperties.add(d),
                        t.ok(c);
                function l(d) {
                    return o.opts.useDefaults && !o.compositeRule && r[d].default !== void 0;
                }
                function u(d) {
                    t.subschema({ keyword: 'properties', schemaProp: d, dataProp: d }, c);
                }
            },
        };
    Ts.default = Od;
});
var wa = g((qs) => {
    'use strict';
    Object.defineProperty(qs, '__esModule', { value: !0 });
    var _a = X(),
        er = P(),
        $a = T(),
        va = T(),
        kd = {
            keyword: 'patternProperties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, data: s, parentSchema: n, it: o } = t,
                    { opts: a } = o,
                    i = (0, _a.allSchemaProperties)(r),
                    c = i.filter((f) => (0, $a.alwaysValidSchema)(o, r[f]));
                if (i.length === 0 || (c.length === i.length && (!o.opts.unevaluated || o.props === !0))) return;
                let l = a.strictSchema && !a.allowMatchingProperties && n.properties,
                    u = e.name('valid');
                o.props !== !0 && !(o.props instanceof er.Name) && (o.props = (0, va.evaluatedPropsToName)(e, o.props));
                let { props: d } = o;
                y();
                function y() {
                    for (let f of i) l && m(f), o.allErrors ? h(f) : (e.var(u, !0), h(f), e.if(u));
                }
                function m(f) {
                    for (let p in l)
                        new RegExp(f).test(p) &&
                            (0, $a.checkStrictMode)(
                                o,
                                `property ${p} matches pattern ${f} (use allowMatchingProperties)`,
                            );
                }
                function h(f) {
                    e.forIn('key', s, (p) => {
                        e.if((0, er._)`${(0, _a.usePattern)(t, f)}.test(${p})`, () => {
                            let _ = c.includes(f);
                            _ ||
                                t.subschema(
                                    {
                                        keyword: 'patternProperties',
                                        schemaProp: f,
                                        dataProp: p,
                                        dataPropType: va.Type.Str,
                                    },
                                    u,
                                ),
                                o.opts.unevaluated && d !== !0
                                    ? e.assign((0, er._)`${d}[${p}]`, !0)
                                    : !_ && !o.allErrors && e.if((0, er.not)(u), () => e.break());
                        });
                    });
                }
            },
        };
    qs.default = kd;
});
var Ea = g((Cs) => {
    'use strict';
    Object.defineProperty(Cs, '__esModule', { value: !0 });
    var Td = T(),
        qd = {
            keyword: 'not',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if ((0, Td.alwaysValidSchema)(s, r)) {
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
    Cs.default = qd;
});
var ba = g((As) => {
    'use strict';
    Object.defineProperty(As, '__esModule', { value: !0 });
    var Cd = X(),
        Ad = {
            keyword: 'anyOf',
            schemaType: 'array',
            trackErrors: !0,
            code: Cd.validateUnion,
            error: { message: 'must match a schema in anyOf' },
        };
    As.default = Ad;
});
var Pa = g((js) => {
    'use strict';
    Object.defineProperty(js, '__esModule', { value: !0 });
    var tr = P(),
        jd = T(),
        Md = {
            message: 'must match exactly one schema in oneOf',
            params: ({ params: t }) => (0, tr._)`{passingSchemas: ${t.passing}}`,
        },
        Dd = {
            keyword: 'oneOf',
            schemaType: 'array',
            trackErrors: !0,
            error: Md,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, it: n } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                if (n.opts.discriminator && s.discriminator) return;
                let o = r,
                    a = e.let('valid', !1),
                    i = e.let('passing', null),
                    c = e.name('_valid');
                t.setParams({ passing: i }),
                    e.block(l),
                    t.result(
                        a,
                        () => t.reset(),
                        () => t.error(!0),
                    );
                function l() {
                    o.forEach((u, d) => {
                        let y;
                        (0, jd.alwaysValidSchema)(n, u)
                            ? e.var(c, !0)
                            : (y = t.subschema({ keyword: 'oneOf', schemaProp: d, compositeRule: !0 }, c)),
                            d > 0 &&
                                e
                                    .if((0, tr._)`${c} && ${a}`)
                                    .assign(a, !1)
                                    .assign(i, (0, tr._)`[${i}, ${d}]`)
                                    .else(),
                            e.if(c, () => {
                                e.assign(a, !0), e.assign(i, d), y && t.mergeEvaluated(y, tr.Name);
                            });
                    });
                }
            },
        };
    js.default = Dd;
});
var Sa = g((Ms) => {
    'use strict';
    Object.defineProperty(Ms, '__esModule', { value: !0 });
    var Ud = T(),
        Vd = {
            keyword: 'allOf',
            schemaType: 'array',
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                let n = e.name('valid');
                r.forEach((o, a) => {
                    if ((0, Ud.alwaysValidSchema)(s, o)) return;
                    let i = t.subschema({ keyword: 'allOf', schemaProp: a }, n);
                    t.ok(n), t.mergeEvaluated(i);
                });
            },
        };
    Ms.default = Vd;
});
var Ia = g((Ds) => {
    'use strict';
    Object.defineProperty(Ds, '__esModule', { value: !0 });
    var rr = P(),
        Ra = T(),
        xd = {
            message: ({ params: t }) => (0, rr.str)`must match "${t.ifClause}" schema`,
            params: ({ params: t }) => (0, rr._)`{failingKeyword: ${t.ifClause}}`,
        },
        zd = {
            keyword: 'if',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            error: xd,
            code(t) {
                let { gen: e, parentSchema: r, it: s } = t;
                r.then === void 0 &&
                    r.else === void 0 &&
                    (0, Ra.checkStrictMode)(s, '"if" without "then" and "else" is ignored');
                let n = Na(s, 'then'),
                    o = Na(s, 'else');
                if (!n && !o) return;
                let a = e.let('valid', !0),
                    i = e.name('_valid');
                if ((c(), t.reset(), n && o)) {
                    let u = e.let('ifClause');
                    t.setParams({ ifClause: u }), e.if(i, l('then', u), l('else', u));
                } else n ? e.if(i, l('then')) : e.if((0, rr.not)(i), l('else'));
                t.pass(a, () => t.error(!0));
                function c() {
                    let u = t.subschema({ keyword: 'if', compositeRule: !0, createErrors: !1, allErrors: !1 }, i);
                    t.mergeEvaluated(u);
                }
                function l(u, d) {
                    return () => {
                        let y = t.subschema({ keyword: u }, i);
                        e.assign(a, i),
                            t.mergeValidEvaluated(y, a),
                            d ? e.assign(d, (0, rr._)`${u}`) : t.setParams({ ifClause: u });
                    };
                }
            },
        };
    function Na(t, e) {
        let r = t.schema[e];
        return r !== void 0 && !(0, Ra.alwaysValidSchema)(t, r);
    }
    Ds.default = zd;
});
var Oa = g((Us) => {
    'use strict';
    Object.defineProperty(Us, '__esModule', { value: !0 });
    var Ld = T(),
        Fd = {
            keyword: ['then', 'else'],
            schemaType: ['object', 'boolean'],
            code({ keyword: t, parentSchema: e, it: r }) {
                e.if === void 0 && (0, Ld.checkStrictMode)(r, `"${t}" without "if" is ignored`);
            },
        };
    Us.default = Fd;
});
var ka = g((Vs) => {
    'use strict';
    Object.defineProperty(Vs, '__esModule', { value: !0 });
    var Kd = ws(),
        Hd = aa(),
        Gd = Es(),
        Jd = ca(),
        Wd = ua(),
        Bd = fa(),
        Qd = pa(),
        Xd = Os(),
        Yd = ga(),
        Zd = wa(),
        ef = Ea(),
        tf = ba(),
        rf = Pa(),
        sf = Sa(),
        nf = Ia(),
        of = Oa();
    function af(t = !1) {
        let e = [
            ef.default,
            tf.default,
            rf.default,
            sf.default,
            nf.default,
            of.default,
            Qd.default,
            Xd.default,
            Bd.default,
            Yd.default,
            Zd.default,
        ];
        return t ? e.push(Hd.default, Jd.default) : e.push(Kd.default, Gd.default), e.push(Wd.default), e;
    }
    Vs.default = af;
});
var Ta = g((xs) => {
    'use strict';
    Object.defineProperty(xs, '__esModule', { value: !0 });
    var D = P(),
        cf = {
            message: ({ schemaCode: t }) => (0, D.str)`must match format "${t}"`,
            params: ({ schemaCode: t }) => (0, D._)`{format: ${t}}`,
        },
        uf = {
            keyword: 'format',
            type: ['number', 'string'],
            schemaType: 'string',
            $data: !0,
            error: cf,
            code(t, e) {
                let { gen: r, data: s, $data: n, schema: o, schemaCode: a, it: i } = t,
                    { opts: c, errSchemaPath: l, schemaEnv: u, self: d } = i;
                if (!c.validateFormats) return;
                n ? y() : m();
                function y() {
                    let h = r.scopeValue('formats', { ref: d.formats, code: c.code.formats }),
                        f = r.const('fDef', (0, D._)`${h}[${a}]`),
                        p = r.let('fType'),
                        _ = r.let('format');
                    r.if(
                        (0, D._)`typeof ${f} == "object" && !(${f} instanceof RegExp)`,
                        () => r.assign(p, (0, D._)`${f}.type || "string"`).assign(_, (0, D._)`${f}.validate`),
                        () => r.assign(p, (0, D._)`"string"`).assign(_, f),
                    ),
                        t.fail$data((0, D.or)(I(), N()));
                    function I() {
                        return c.strictSchema === !1 ? D.nil : (0, D._)`${a} && !${_}`;
                    }
                    function N() {
                        let A = u.$async
                                ? (0, D._)`(${f}.async ? await ${_}(${s}) : ${_}(${s}))`
                                : (0, D._)`${_}(${s})`,
                            w = (0, D._)`(typeof ${_} == "function" ? ${A} : ${_}.test(${s}))`;
                        return (0, D._)`${_} && ${_} !== true && ${p} === ${e} && !${w}`;
                    }
                }
                function m() {
                    let h = d.formats[o];
                    if (!h) {
                        I();
                        return;
                    }
                    if (h === !0) return;
                    let [f, p, _] = N(h);
                    f === e && t.pass(A());
                    function I() {
                        if (c.strictSchema === !1) {
                            d.logger.warn(w());
                            return;
                        }
                        throw new Error(w());
                        function w() {
                            return `unknown format "${o}" ignored in schema at path "${l}"`;
                        }
                    }
                    function N(w) {
                        let ne =
                                w instanceof RegExp
                                    ? (0, D.regexpCode)(w)
                                    : c.code.formats
                                      ? (0, D._)`${c.code.formats}${(0, D.getProperty)(o)}`
                                      : void 0,
                            le = r.scopeValue('formats', { key: o, ref: w, code: ne });
                        return typeof w == 'object' && !(w instanceof RegExp)
                            ? [w.type || 'string', w.validate, (0, D._)`${le}.validate`]
                            : ['string', w, le];
                    }
                    function A() {
                        if (typeof h == 'object' && !(h instanceof RegExp) && h.async) {
                            if (!u.$async) throw new Error('async format in sync schema');
                            return (0, D._)`await ${_}(${s})`;
                        }
                        return typeof p == 'function' ? (0, D._)`${_}(${s})` : (0, D._)`${_}.test(${s})`;
                    }
                }
            },
        };
    xs.default = uf;
});
var qa = g((zs) => {
    'use strict';
    Object.defineProperty(zs, '__esModule', { value: !0 });
    var lf = Ta(),
        df = [lf.default];
    zs.default = df;
});
var Ca = g((He) => {
    'use strict';
    Object.defineProperty(He, '__esModule', { value: !0 });
    He.contentVocabulary = He.metadataVocabulary = void 0;
    He.metadataVocabulary = ['title', 'description', 'default', 'deprecated', 'readOnly', 'writeOnly', 'examples'];
    He.contentVocabulary = ['contentMediaType', 'contentEncoding', 'contentSchema'];
});
var ja = g((Ls) => {
    'use strict';
    Object.defineProperty(Ls, '__esModule', { value: !0 });
    var ff = Lo(),
        hf = ra(),
        pf = ka(),
        mf = qa(),
        Aa = Ca(),
        yf = [ff.default, hf.default, (0, pf.default)(), mf.default, Aa.metadataVocabulary, Aa.contentVocabulary];
    Ls.default = yf;
});
var Da = g((sr) => {
    'use strict';
    Object.defineProperty(sr, '__esModule', { value: !0 });
    sr.DiscrError = void 0;
    var Ma;
    (function (t) {
        (t.Tag = 'tag'), (t.Mapping = 'mapping');
    })(Ma || (sr.DiscrError = Ma = {}));
});
var Va = g((Ks) => {
    'use strict';
    Object.defineProperty(Ks, '__esModule', { value: !0 });
    var Ge = P(),
        Fs = Da(),
        Ua = Vt(),
        gf = lt(),
        _f = T(),
        $f = {
            message: ({ params: { discrError: t, tagName: e } }) =>
                t === Fs.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
            params: ({ params: { discrError: t, tag: e, tagName: r } }) =>
                (0, Ge._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`,
        },
        vf = {
            keyword: 'discriminator',
            type: 'object',
            schemaType: 'object',
            error: $f,
            code(t) {
                let { gen: e, data: r, schema: s, parentSchema: n, it: o } = t,
                    { oneOf: a } = n;
                if (!o.opts.discriminator) throw new Error('discriminator: requires discriminator option');
                let i = s.propertyName;
                if (typeof i != 'string') throw new Error('discriminator: requires propertyName');
                if (s.mapping) throw new Error('discriminator: mapping is not supported');
                if (!a) throw new Error('discriminator: requires oneOf keyword');
                let c = e.let('valid', !1),
                    l = e.const('tag', (0, Ge._)`${r}${(0, Ge.getProperty)(i)}`);
                e.if(
                    (0, Ge._)`typeof ${l} == "string"`,
                    () => u(),
                    () => t.error(!1, { discrError: Fs.DiscrError.Tag, tag: l, tagName: i }),
                ),
                    t.ok(c);
                function u() {
                    let m = y();
                    e.if(!1);
                    for (let h in m) e.elseIf((0, Ge._)`${l} === ${h}`), e.assign(c, d(m[h]));
                    e.else(), t.error(!1, { discrError: Fs.DiscrError.Mapping, tag: l, tagName: i }), e.endIf();
                }
                function d(m) {
                    let h = e.name('valid'),
                        f = t.subschema({ keyword: 'oneOf', schemaProp: m }, h);
                    return t.mergeEvaluated(f, Ge.Name), h;
                }
                function y() {
                    var m;
                    let h = {},
                        f = _(n),
                        p = !0;
                    for (let A = 0; A < a.length; A++) {
                        let w = a[A];
                        if (w?.$ref && !(0, _f.schemaHasRulesButRef)(w, o.self.RULES)) {
                            let le = w.$ref;
                            if (
                                ((w = Ua.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, le)),
                                w instanceof Ua.SchemaEnv && (w = w.schema),
                                w === void 0)
                            )
                                throw new gf.default(o.opts.uriResolver, o.baseId, le);
                        }
                        let ne = (m = w?.properties) === null || m === void 0 ? void 0 : m[i];
                        if (typeof ne != 'object')
                            throw new Error(
                                `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`,
                            );
                        (p = p && (f || _(w))), I(ne, A);
                    }
                    if (!p) throw new Error(`discriminator: "${i}" must be required`);
                    return h;
                    function _({ required: A }) {
                        return Array.isArray(A) && A.includes(i);
                    }
                    function I(A, w) {
                        if (A.const) N(A.const, w);
                        else if (A.enum) for (let ne of A.enum) N(ne, w);
                        else throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
                    }
                    function N(A, w) {
                        if (typeof A != 'string' || A in h)
                            throw new Error(`discriminator: "${i}" values must be unique strings`);
                        h[A] = w;
                    }
                }
            },
        };
    Ks.default = vf;
});
var xa = g((kp, wf) => {
    wf.exports = {
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
var La = g((M, Hs) => {
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
    var Ef = Mo(),
        bf = ja(),
        Pf = Va(),
        za = xa(),
        Sf = ['/properties'],
        nr = 'http://json-schema.org/draft-07/schema',
        Je = class extends Ef.default {
            _addVocabularies() {
                super._addVocabularies(),
                    bf.default.forEach((e) => this.addVocabulary(e)),
                    this.opts.discriminator && this.addKeyword(Pf.default);
            }
            _addDefaultMetaSchema() {
                if ((super._addDefaultMetaSchema(), !this.opts.meta)) return;
                let e = this.opts.$data ? this.$dataMetaSchema(za, Sf) : za;
                this.addMetaSchema(e, nr, !1), (this.refs['http://json-schema.org/schema'] = nr);
            }
            defaultMeta() {
                return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(nr) ? nr : void 0));
            }
        };
    M.Ajv = Je;
    Hs.exports = M = Je;
    Hs.exports.Ajv = Je;
    Object.defineProperty(M, '__esModule', { value: !0 });
    M.default = Je;
    var Nf = ut();
    Object.defineProperty(M, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return Nf.KeywordCxt;
        },
    });
    var We = P();
    Object.defineProperty(M, '_', {
        enumerable: !0,
        get: function () {
            return We._;
        },
    });
    Object.defineProperty(M, 'str', {
        enumerable: !0,
        get: function () {
            return We.str;
        },
    });
    Object.defineProperty(M, 'stringify', {
        enumerable: !0,
        get: function () {
            return We.stringify;
        },
    });
    Object.defineProperty(M, 'nil', {
        enumerable: !0,
        get: function () {
            return We.nil;
        },
    });
    Object.defineProperty(M, 'Name', {
        enumerable: !0,
        get: function () {
            return We.Name;
        },
    });
    Object.defineProperty(M, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return We.CodeGen;
        },
    });
    var Rf = Dt();
    Object.defineProperty(M, 'ValidationError', {
        enumerable: !0,
        get: function () {
            return Rf.default;
        },
    });
    var If = lt();
    Object.defineProperty(M, 'MissingRefError', {
        enumerable: !0,
        get: function () {
            return If.default;
        },
    });
});
var Tf = {};
Ya(Tf, { handleHttp: () => kf, schema: () => Ha });
module.exports = ei(Tf);
var ye = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    ti =
        /^(([^<>()[\]\\.,;:\s@"A-Z]+(\.[^<>()[\]\\.,;:\s@"A-Z]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
var Bs = (t) => ti.exec(t)?.[0];
var Qs = (t, e) => {
    try {
        return JSON.parse(e);
    } catch {
        return t;
    }
};
var Ae = (t) => ({ statusCode: 403, headers: ye, body: typeof t == 'string' ? t : JSON.stringify(t) });
var oe = (t) => ({ statusCode: 400, headers: ye, body: typeof t == 'string' ? t : JSON.stringify(t) });
var Xs = (t) => ({ statusCode: 404, headers: ye, body: t ? JSON.stringify(t) : 'Not Found' }),
    Ys = (t) => ({ statusCode: 422, headers: ye, body: t ? JSON.stringify(t) : 'Unprocessable Entity' }),
    cr = (t) => (t.statusCode ? t : (console.error(t), { statusCode: 500, headers: ye, body: t.message }));
var Zs = oe({
        name: 'InvalidEmailError',
        message: 'The email must be valid and must not contain upper case letters or spaces.',
    }),
    Vf = oe({
        name: 'InvalidPasswordError',
        message: 'The password must contain at least 8 characters and at least 1 number.',
    }),
    en = oe({
        name: 'InvalidSrpAError',
        message: 'The SRP A value must be a correctly calculated random hex hash based on big integers.',
    }),
    xf = oe({ name: 'InvalidRefreshTokenError', message: 'Refresh token is invalid.' }),
    zf = oe({ name: 'VerificationCodeMismatchError', message: 'The verification code does not match.' }),
    Lf = Ae({
        name: 'VerificationCodeExpiredError',
        message:
            'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
    }),
    tn = Xs({ name: 'UserNotFoundError', message: 'No user was found under the given email or user ID.' }),
    rn = Ae({ name: 'UserNotVerifiedError', message: 'The user must be verified with Register Verify operation.' }),
    Ff = Ae({ name: 'UserExistsError', message: 'There is an existing user with the given email address.' }),
    Kf = oe({
        name: 'UserMissingPasswordChallengeError',
        message: 'The user must have an active require password change challenge.',
    }),
    sn = Ae({ name: 'PasswordResetRequiredError', message: 'The password must be reset.' }),
    Hf = Ys({
        name: 'PasswordResetMissingParamError',
        message: 'Either a verification code or the users old password are required.',
    }),
    Gf = Ae({
        name: 'LoginVerifyError',
        message:
            'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
    });
var nn = process.env.AWS_REGION || '',
    ri = process.env.ADMIN_EMAILS || '',
    Wf = process.env.CLOUDFRONT_ACCESS_KEY_ID || '',
    Bf = process.env.CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER || '',
    Qf = process.env.INVITE_USER_VALIDATION_VIEW || '',
    Xf = process.env.PULL_LAMBDA_NAME || '',
    Yf = process.env.MEDIA_DOMAIN || '',
    on = process.env.CLIENT_ID || '',
    an = process.env.USER_POOL_ID || '';
var si = require('crypto');
var U = require('@aws-sdk/client-cognito-identity-provider');
var ni = new U.CognitoIdentityProviderClient({ region: nn, apiVersion: 'latest' });
var cn = async (t, e) => {
    let r = new U.InitiateAuthCommand({
            ClientId: on,
            AuthFlow: 'USER_SRP_AUTH',
            AuthParameters: { USERNAME: t, SRP_A: e },
        }),
        s = await ni.send(r);
    return {
        poolname: an.split('_')[1],
        userId: s?.ChallengeParameters?.USERNAME,
        srpB: s?.ChallengeParameters?.SRP_B,
        secretBlock: s?.ChallengeParameters?.SECRET_BLOCK,
        salt: s?.ChallengeParameters?.SALT,
    };
};
var Fa = Za(La(), 1);
var Ka = async (t, e) => {
    let r = null;
    try {
        let s = Qs(e.body || {}, e.body || ''),
            n = new Fa.Ajv();
        if ((n.addKeyword('example'), n.validate(t, s))) return { body: s };
        r = oe(JSON.stringify(n.errors));
    } catch (s) {
        r = oe(s.message);
    }
    throw r;
};
var Ha = {
        type: 'object',
        properties: {
            email: { type: 'string', description: 'Email of the user to be logged in.' },
            srpA: {
                type: 'string',
                description: 'Client SRP A value that will be used to initiate an SRP auth process.',
            },
        },
        required: ['email', 'srpA'],
    },
    Of = async ({ body: t }) => {
        let { email: e, srpA: r } = t;
        if (Bs(e) !== e) return Zs;
        try {
            let s = await cn(e, r);
            return { statusCode: 200, headers: ye, body: JSON.stringify(s) };
        } catch (s) {
            switch (s.name) {
                case 'InvalidParameterException':
                    return en;
                case 'UserNotFoundException':
                    return tn;
                case 'UserNotConfirmedException':
                    return rn;
                case 'PasswordResetRequiredException':
                    return sn;
                default:
                    return console.error(s), cr(s);
            }
        }
    },
    kf = async (t) => {
        try {
            let e = await Ka(Ha, t);
            return await Of(e);
        } catch (e) {
            return cr(e);
        }
    };
0 && (module.exports = { handleHttp, schema });
