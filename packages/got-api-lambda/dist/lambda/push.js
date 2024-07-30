'use strict';
var Ic = Object.create;
var fr = Object.defineProperty;
var Dc = Object.getOwnPropertyDescriptor;
var qc = Object.getOwnPropertyNames;
var xc = Object.getPrototypeOf,
    Fc = Object.prototype.hasOwnProperty;
var R = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    Vc = (t, e) => {
        for (var r in e) fr(t, r, { get: e[r], enumerable: !0 });
    },
    no = (t, e, r, s) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
            for (let n of qc(e))
                !Fc.call(t, n) && n !== r && fr(t, n, { get: () => e[n], enumerable: !(s = Dc(e, n)) || s.enumerable });
        return t;
    };
var Uc = (t, e, r) => (
        (r = t != null ? Ic(xc(t)) : {}),
        no(e || !t || !t.__esModule ? fr(r, 'default', { value: t, enumerable: !0 }) : r, t)
    ),
    Lc = (t) => no(fr({}, '__esModule', { value: !0 }), t);
var xt = R((x) => {
    'use strict';
    Object.defineProperty(x, '__esModule', { value: !0 });
    x.regexpCode =
        x.getEsmExportName =
        x.getProperty =
        x.safeStringify =
        x.stringify =
        x.strConcat =
        x.addCodeArg =
        x.str =
        x._ =
        x.nil =
        x._Code =
        x.Name =
        x.IDENTIFIER =
        x._CodeOrName =
            void 0;
    var Dt = class {};
    x._CodeOrName = Dt;
    x.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Xe = class extends Dt {
        constructor(e) {
            if ((super(), !x.IDENTIFIER.test(e))) throw new Error('CodeGen: name must be a valid identifier');
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
    x.Name = Xe;
    var pe = class extends Dt {
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
                      (r, s) => (s instanceof Xe && (r[s.str] = (r[s.str] || 0) + 1), r),
                      {},
                  ));
        }
    };
    x._Code = pe;
    x.nil = new pe('');
    function Co(t, ...e) {
        let r = [t[0]],
            s = 0;
        for (; s < e.length; ) fs(r, e[s]), r.push(t[++s]);
        return new pe(r);
    }
    x._ = Co;
    var ds = new pe('+');
    function Ao(t, ...e) {
        let r = [qt(t[0])],
            s = 0;
        for (; s < e.length; ) r.push(ds), fs(r, e[s]), r.push(ds, qt(t[++s]));
        return wu(r), new pe(r);
    }
    x.str = Ao;
    function fs(t, e) {
        e instanceof pe ? t.push(...e._items) : e instanceof Xe ? t.push(e) : t.push(bu(e));
    }
    x.addCodeArg = fs;
    function wu(t) {
        let e = 1;
        for (; e < t.length - 1; ) {
            if (t[e] === ds) {
                let r = vu(t[e - 1], t[e + 1]);
                if (r !== void 0) {
                    t.splice(e - 1, 3, r);
                    continue;
                }
                t[e++] = '+';
            }
            e++;
        }
    }
    function vu(t, e) {
        if (e === '""') return t;
        if (t === '""') return e;
        if (typeof t == 'string')
            return e instanceof Xe || t[t.length - 1] !== '"'
                ? void 0
                : typeof e != 'string'
                  ? `${t.slice(0, -1)}${e}"`
                  : e[0] === '"'
                    ? t.slice(0, -1) + e.slice(1)
                    : void 0;
        if (typeof e == 'string' && e[0] === '"' && !(t instanceof Xe)) return `"${t}${e.slice(1)}`;
    }
    function $u(t, e) {
        return e.emptyStr() ? t : t.emptyStr() ? e : Ao`${t}${e}`;
    }
    x.strConcat = $u;
    function bu(t) {
        return typeof t == 'number' || typeof t == 'boolean' || t === null ? t : qt(Array.isArray(t) ? t.join(',') : t);
    }
    function Su(t) {
        return new pe(qt(t));
    }
    x.stringify = Su;
    function qt(t) {
        return JSON.stringify(t)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
    }
    x.safeStringify = qt;
    function Pu(t) {
        return typeof t == 'string' && x.IDENTIFIER.test(t) ? new pe(`.${t}`) : Co`[${t}]`;
    }
    x.getProperty = Pu;
    function Ru(t) {
        if (typeof t == 'string' && x.IDENTIFIER.test(t)) return new pe(`${t}`);
        throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`);
    }
    x.getEsmExportName = Ru;
    function Ou(t) {
        return new pe(t.toString());
    }
    x.regexpCode = Ou;
});
var ms = R((ae) => {
    'use strict';
    Object.defineProperty(ae, '__esModule', { value: !0 });
    ae.ValueScope = ae.ValueScopeName = ae.Scope = ae.varKinds = ae.UsedValueState = void 0;
    var ie = xt(),
        ps = class extends Error {
            constructor(e) {
                super(`CodeGen: "code" for ${e} not defined`), (this.value = e.value);
            }
        },
        wr;
    (function (t) {
        (t[(t.Started = 0)] = 'Started'), (t[(t.Completed = 1)] = 'Completed');
    })(wr || (ae.UsedValueState = wr = {}));
    ae.varKinds = { const: new ie.Name('const'), let: new ie.Name('let'), var: new ie.Name('var') };
    var vr = class {
        constructor({ prefixes: e, parent: r } = {}) {
            (this._names = {}), (this._prefixes = e), (this._parent = r);
        }
        toName(e) {
            return e instanceof ie.Name ? e : this.name(e);
        }
        name(e) {
            return new ie.Name(this._newName(e));
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
    ae.Scope = vr;
    var $r = class extends ie.Name {
        constructor(e, r) {
            super(r), (this.prefix = e);
        }
        setValue(e, { property: r, itemIndex: s }) {
            (this.value = e), (this.scopePath = (0, ie._)`.${new ie.Name(r)}[${s}]`);
        }
    };
    ae.ValueScopeName = $r;
    var Tu = (0, ie._)`\n`,
        hs = class extends vr {
            constructor(e) {
                super(e),
                    (this._values = {}),
                    (this._scope = e.scope),
                    (this.opts = { ...e, _n: e.lines ? Tu : ie.nil });
            }
            get() {
                return this._scope;
            }
            name(e) {
                return new $r(e, this._newName(e));
            }
            value(e, r) {
                var s;
                if (r.ref === void 0) throw new Error('CodeGen: ref must be passed in value');
                let n = this.toName(e),
                    { prefix: o } = n,
                    i = (s = r.key) !== null && s !== void 0 ? s : r.ref,
                    a = this._values[o];
                if (a) {
                    let l = a.get(i);
                    if (l) return l;
                } else a = this._values[o] = new Map();
                a.set(i, n);
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
                    return (0, ie._)`${e}${s.scopePath}`;
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
                let o = ie.nil;
                for (let i in e) {
                    let a = e[i];
                    if (!a) continue;
                    let c = (s[i] = s[i] || new Map());
                    a.forEach((u) => {
                        if (c.has(u)) return;
                        c.set(u, wr.Started);
                        let l = r(u);
                        if (l) {
                            let f = this.opts.es5 ? ae.varKinds.var : ae.varKinds.const;
                            o = (0, ie._)`${o}${f} ${u} = ${l};${this.opts._n}`;
                        } else if ((l = n?.(u))) o = (0, ie._)`${o}${l}${this.opts._n}`;
                        else throw new ps(u);
                        c.set(u, wr.Completed);
                    });
                }
                return o;
            }
        };
    ae.ValueScope = hs;
});
var j = R((G) => {
    'use strict';
    Object.defineProperty(G, '__esModule', { value: !0 });
    G.or =
        G.and =
        G.not =
        G.CodeGen =
        G.operators =
        G.varKinds =
        G.ValueScopeName =
        G.ValueScope =
        G.Scope =
        G.Name =
        G.regexpCode =
        G.stringify =
        G.getProperty =
        G.nil =
        G.strConcat =
        G.str =
        G._ =
            void 0;
    var D = xt(),
        ye = ms(),
        Ue = xt();
    Object.defineProperty(G, '_', {
        enumerable: !0,
        get: function () {
            return Ue._;
        },
    });
    Object.defineProperty(G, 'str', {
        enumerable: !0,
        get: function () {
            return Ue.str;
        },
    });
    Object.defineProperty(G, 'strConcat', {
        enumerable: !0,
        get: function () {
            return Ue.strConcat;
        },
    });
    Object.defineProperty(G, 'nil', {
        enumerable: !0,
        get: function () {
            return Ue.nil;
        },
    });
    Object.defineProperty(G, 'getProperty', {
        enumerable: !0,
        get: function () {
            return Ue.getProperty;
        },
    });
    Object.defineProperty(G, 'stringify', {
        enumerable: !0,
        get: function () {
            return Ue.stringify;
        },
    });
    Object.defineProperty(G, 'regexpCode', {
        enumerable: !0,
        get: function () {
            return Ue.regexpCode;
        },
    });
    Object.defineProperty(G, 'Name', {
        enumerable: !0,
        get: function () {
            return Ue.Name;
        },
    });
    var Rr = ms();
    Object.defineProperty(G, 'Scope', {
        enumerable: !0,
        get: function () {
            return Rr.Scope;
        },
    });
    Object.defineProperty(G, 'ValueScope', {
        enumerable: !0,
        get: function () {
            return Rr.ValueScope;
        },
    });
    Object.defineProperty(G, 'ValueScopeName', {
        enumerable: !0,
        get: function () {
            return Rr.ValueScopeName;
        },
    });
    Object.defineProperty(G, 'varKinds', {
        enumerable: !0,
        get: function () {
            return Rr.varKinds;
        },
    });
    G.operators = {
        GT: new D._Code('>'),
        GTE: new D._Code('>='),
        LT: new D._Code('<'),
        LTE: new D._Code('<='),
        EQ: new D._Code('==='),
        NEQ: new D._Code('!=='),
        NOT: new D._Code('!'),
        OR: new D._Code('||'),
        AND: new D._Code('&&'),
        ADD: new D._Code('+'),
    };
    var Ge = class {
            optimizeNodes() {
                return this;
            }
            optimizeNames(e, r) {
                return this;
            }
        },
        gs = class extends Ge {
            constructor(e, r, s) {
                super(), (this.varKind = e), (this.name = r), (this.rhs = s);
            }
            render({ es5: e, _n: r }) {
                let s = e ? ye.varKinds.var : this.varKind,
                    n = this.rhs === void 0 ? '' : ` = ${this.rhs}`;
                return `${s} ${this.name}${n};${r}`;
            }
            optimizeNames(e, r) {
                if (e[this.name.str]) return this.rhs && (this.rhs = pt(this.rhs, e, r)), this;
            }
            get names() {
                return this.rhs instanceof D._CodeOrName ? this.rhs.names : {};
            }
        },
        br = class extends Ge {
            constructor(e, r, s) {
                super(), (this.lhs = e), (this.rhs = r), (this.sideEffects = s);
            }
            render({ _n: e }) {
                return `${this.lhs} = ${this.rhs};${e}`;
            }
            optimizeNames(e, r) {
                if (!(this.lhs instanceof D.Name && !e[this.lhs.str] && !this.sideEffects))
                    return (this.rhs = pt(this.rhs, e, r)), this;
            }
            get names() {
                let e = this.lhs instanceof D.Name ? {} : { ...this.lhs.names };
                return Pr(e, this.rhs);
            }
        },
        ys = class extends br {
            constructor(e, r, s, n) {
                super(e, s, n), (this.op = r);
            }
            render({ _n: e }) {
                return `${this.lhs} ${this.op}= ${this.rhs};${e}`;
            }
        },
        _s = class extends Ge {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `${this.label}:${e}`;
            }
        },
        Es = class extends Ge {
            constructor(e) {
                super(), (this.label = e), (this.names = {});
            }
            render({ _n: e }) {
                return `break${this.label ? ` ${this.label}` : ''};${e}`;
            }
        },
        ws = class extends Ge {
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
        vs = class extends Ge {
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
                return (this.code = pt(this.code, e, r)), this;
            }
            get names() {
                return this.code instanceof D._CodeOrName ? this.code.names : {};
            }
        },
        Ft = class extends Ge {
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
                    o.optimizeNames(e, r) || (Nu(e, o.names), s.splice(n, 1));
                }
                return s.length > 0 ? this : void 0;
            }
            get names() {
                return this.nodes.reduce((e, r) => tt(e, r.names), {});
            }
        },
        je = class extends Ft {
            render(e) {
                return `{${e._n}${super.render(e)}}${e._n}`;
            }
        },
        $s = class extends Ft {},
        ft = class extends je {};
    ft.kind = 'else';
    var Ze = class t extends je {
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
                r = this.else = Array.isArray(s) ? new ft(s) : s;
            }
            if (r)
                return e === !1
                    ? r instanceof t
                        ? r
                        : r.nodes
                    : this.nodes.length
                      ? this
                      : new t(Mo(e), r instanceof t ? [r] : r.nodes);
            if (!(e === !1 || !this.nodes.length)) return this;
        }
        optimizeNames(e, r) {
            var s;
            if (
                ((this.else = (s = this.else) === null || s === void 0 ? void 0 : s.optimizeNames(e, r)),
                !!(super.optimizeNames(e, r) || this.else))
            )
                return (this.condition = pt(this.condition, e, r)), this;
        }
        get names() {
            let e = super.names;
            return Pr(e, this.condition), this.else && tt(e, this.else.names), e;
        }
    };
    Ze.kind = 'if';
    var et = class extends je {};
    et.kind = 'for';
    var bs = class extends et {
            constructor(e) {
                super(), (this.iteration = e);
            }
            render(e) {
                return `for(${this.iteration})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iteration = pt(this.iteration, e, r)), this;
            }
            get names() {
                return tt(super.names, this.iteration.names);
            }
        },
        Ss = class extends et {
            constructor(e, r, s, n) {
                super(), (this.varKind = e), (this.name = r), (this.from = s), (this.to = n);
            }
            render(e) {
                let r = e.es5 ? ye.varKinds.var : this.varKind,
                    { name: s, from: n, to: o } = this;
                return `for(${r} ${s}=${n}; ${s}<${o}; ${s}++)${super.render(e)}`;
            }
            get names() {
                let e = Pr(super.names, this.from);
                return Pr(e, this.to);
            }
        },
        Sr = class extends et {
            constructor(e, r, s, n) {
                super(), (this.loop = e), (this.varKind = r), (this.name = s), (this.iterable = n);
            }
            render(e) {
                return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})${super.render(e)}`;
            }
            optimizeNames(e, r) {
                if (super.optimizeNames(e, r)) return (this.iterable = pt(this.iterable, e, r)), this;
            }
            get names() {
                return tt(super.names, this.iterable.names);
            }
        },
        Vt = class extends je {
            constructor(e, r, s) {
                super(), (this.name = e), (this.args = r), (this.async = s);
            }
            render(e) {
                return `${this.async ? 'async ' : ''}function ${this.name}(${this.args})${super.render(e)}`;
            }
        };
    Vt.kind = 'func';
    var Ut = class extends Ft {
        render(e) {
            return `return ${super.render(e)}`;
        }
    };
    Ut.kind = 'return';
    var Ps = class extends je {
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
                return this.catch && tt(e, this.catch.names), this.finally && tt(e, this.finally.names), e;
            }
        },
        Lt = class extends je {
            constructor(e) {
                super(), (this.error = e);
            }
            render(e) {
                return `catch(${this.error})${super.render(e)}`;
            }
        };
    Lt.kind = 'catch';
    var Kt = class extends je {
        render(e) {
            return `finally${super.render(e)}`;
        }
    };
    Kt.kind = 'finally';
    var Rs = class {
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
                (this._scope = new ye.Scope({ parent: e })),
                (this._nodes = [new $s()]);
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
            return s !== void 0 && n && (this._constants[o.str] = s), this._leafNode(new gs(e, o, s)), o;
        }
        const(e, r, s) {
            return this._def(ye.varKinds.const, e, r, s);
        }
        let(e, r, s) {
            return this._def(ye.varKinds.let, e, r, s);
        }
        var(e, r, s) {
            return this._def(ye.varKinds.var, e, r, s);
        }
        assign(e, r, s) {
            return this._leafNode(new br(e, r, s));
        }
        add(e, r) {
            return this._leafNode(new ys(e, G.operators.ADD, r));
        }
        code(e) {
            return typeof e == 'function' ? e() : e !== D.nil && this._leafNode(new vs(e)), this;
        }
        object(...e) {
            let r = ['{'];
            for (let [s, n] of e)
                r.length > 1 && r.push(','),
                    r.push(s),
                    (s !== n || this.opts.es5) && (r.push(':'), (0, D.addCodeArg)(r, n));
            return r.push('}'), new D._Code(r);
        }
        if(e, r, s) {
            if ((this._blockNode(new Ze(e)), r && s)) this.code(r).else().code(s).endIf();
            else if (r) this.code(r).endIf();
            else if (s) throw new Error('CodeGen: "else" body without "then" body');
            return this;
        }
        elseIf(e) {
            return this._elseNode(new Ze(e));
        }
        else() {
            return this._elseNode(new ft());
        }
        endIf() {
            return this._endBlockNode(Ze, ft);
        }
        _for(e, r) {
            return this._blockNode(e), r && this.code(r).endFor(), this;
        }
        for(e, r) {
            return this._for(new bs(e), r);
        }
        forRange(e, r, s, n, o = this.opts.es5 ? ye.varKinds.var : ye.varKinds.let) {
            let i = this._scope.toName(e);
            return this._for(new Ss(o, i, r, s), () => n(i));
        }
        forOf(e, r, s, n = ye.varKinds.const) {
            let o = this._scope.toName(e);
            if (this.opts.es5) {
                let i = r instanceof D.Name ? r : this.var('_arr', r);
                return this.forRange('_i', 0, (0, D._)`${i}.length`, (a) => {
                    this.var(o, (0, D._)`${i}[${a}]`), s(o);
                });
            }
            return this._for(new Sr('of', n, o, r), () => s(o));
        }
        forIn(e, r, s, n = this.opts.es5 ? ye.varKinds.var : ye.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(e, (0, D._)`Object.keys(${r})`, s);
            let o = this._scope.toName(e);
            return this._for(new Sr('in', n, o, r), () => s(o));
        }
        endFor() {
            return this._endBlockNode(et);
        }
        label(e) {
            return this._leafNode(new _s(e));
        }
        break(e) {
            return this._leafNode(new Es(e));
        }
        return(e) {
            let r = new Ut();
            if ((this._blockNode(r), this.code(e), r.nodes.length !== 1))
                throw new Error('CodeGen: "return" should have one node');
            return this._endBlockNode(Ut);
        }
        try(e, r, s) {
            if (!r && !s) throw new Error('CodeGen: "try" without "catch" and "finally"');
            let n = new Ps();
            if ((this._blockNode(n), this.code(e), r)) {
                let o = this.name('e');
                (this._currNode = n.catch = new Lt(o)), r(o);
            }
            return s && ((this._currNode = n.finally = new Kt()), this.code(s)), this._endBlockNode(Lt, Kt);
        }
        throw(e) {
            return this._leafNode(new ws(e));
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
        func(e, r = D.nil, s, n) {
            return this._blockNode(new Vt(e, r, s)), n && this.code(n).endFunc(), this;
        }
        endFunc() {
            return this._endBlockNode(Vt);
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
            if (!(r instanceof Ze)) throw new Error('CodeGen: "else" without "if"');
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
    G.CodeGen = Rs;
    function tt(t, e) {
        for (let r in e) t[r] = (t[r] || 0) + (e[r] || 0);
        return t;
    }
    function Pr(t, e) {
        return e instanceof D._CodeOrName ? tt(t, e.names) : t;
    }
    function pt(t, e, r) {
        if (t instanceof D.Name) return s(t);
        if (!n(t)) return t;
        return new D._Code(
            t._items.reduce(
                (o, i) => (
                    i instanceof D.Name && (i = s(i)), i instanceof D._Code ? o.push(...i._items) : o.push(i), o
                ),
                [],
            ),
        );
        function s(o) {
            let i = r[o.str];
            return i === void 0 || e[o.str] !== 1 ? o : (delete e[o.str], i);
        }
        function n(o) {
            return (
                o instanceof D._Code &&
                o._items.some((i) => i instanceof D.Name && e[i.str] === 1 && r[i.str] !== void 0)
            );
        }
    }
    function Nu(t, e) {
        for (let r in e) t[r] = (t[r] || 0) - (e[r] || 0);
    }
    function Mo(t) {
        return typeof t == 'boolean' || typeof t == 'number' || t === null ? !t : (0, D._)`!${Os(t)}`;
    }
    G.not = Mo;
    var Cu = Go(G.operators.AND);
    function Au(...t) {
        return t.reduce(Cu);
    }
    G.and = Au;
    var Mu = Go(G.operators.OR);
    function Gu(...t) {
        return t.reduce(Mu);
    }
    G.or = Gu;
    function Go(t) {
        return (e, r) => (e === D.nil ? r : r === D.nil ? e : (0, D._)`${Os(e)} ${t} ${Os(r)}`);
    }
    function Os(t) {
        return t instanceof D.Name ? t : (0, D._)`(${t})`;
    }
});
var F = R((k) => {
    'use strict';
    Object.defineProperty(k, '__esModule', { value: !0 });
    k.checkStrictMode =
        k.getErrorPath =
        k.Type =
        k.useFunc =
        k.setEvaluated =
        k.evaluatedPropsToName =
        k.mergeEvaluated =
        k.eachItem =
        k.unescapeJsonPointer =
        k.escapeJsonPointer =
        k.escapeFragment =
        k.unescapeFragment =
        k.schemaRefOrVal =
        k.schemaHasRulesButRef =
        k.schemaHasRules =
        k.checkUnknownRules =
        k.alwaysValidSchema =
        k.toHash =
            void 0;
    var K = j(),
        ju = xt();
    function ku(t) {
        let e = {};
        for (let r of t) e[r] = !0;
        return e;
    }
    k.toHash = ku;
    function Iu(t, e) {
        return typeof e == 'boolean' ? e : Object.keys(e).length === 0 ? !0 : (Io(t, e), !Do(e, t.self.RULES.all));
    }
    k.alwaysValidSchema = Iu;
    function Io(t, e = t.schema) {
        let { opts: r, self: s } = t;
        if (!r.strictSchema || typeof e == 'boolean') return;
        let n = s.RULES.keywords;
        for (let o in e) n[o] || Fo(t, `unknown keyword: "${o}"`);
    }
    k.checkUnknownRules = Io;
    function Do(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e[r]) return !0;
        return !1;
    }
    k.schemaHasRules = Do;
    function Du(t, e) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (r !== '$ref' && e.all[r]) return !0;
        return !1;
    }
    k.schemaHasRulesButRef = Du;
    function qu({ topSchemaRef: t, schemaPath: e }, r, s, n) {
        if (!n) {
            if (typeof r == 'number' || typeof r == 'boolean') return r;
            if (typeof r == 'string') return (0, K._)`${r}`;
        }
        return (0, K._)`${t}${e}${(0, K.getProperty)(s)}`;
    }
    k.schemaRefOrVal = qu;
    function xu(t) {
        return qo(decodeURIComponent(t));
    }
    k.unescapeFragment = xu;
    function Fu(t) {
        return encodeURIComponent(Ns(t));
    }
    k.escapeFragment = Fu;
    function Ns(t) {
        return typeof t == 'number' ? `${t}` : t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
    k.escapeJsonPointer = Ns;
    function qo(t) {
        return t.replace(/~1/g, '/').replace(/~0/g, '~');
    }
    k.unescapeJsonPointer = qo;
    function Vu(t, e) {
        if (Array.isArray(t)) for (let r of t) e(r);
        else e(t);
    }
    k.eachItem = Vu;
    function jo({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: s }) {
        return (n, o, i, a) => {
            let c =
                i === void 0
                    ? o
                    : i instanceof K.Name
                      ? (o instanceof K.Name ? t(n, o, i) : e(n, o, i), i)
                      : o instanceof K.Name
                        ? (e(n, i, o), o)
                        : r(o, i);
            return a === K.Name && !(c instanceof K.Name) ? s(n, c) : c;
        };
    }
    k.mergeEvaluated = {
        props: jo({
            mergeNames: (t, e, r) =>
                t.if((0, K._)`${r} !== true && ${e} !== undefined`, () => {
                    t.if(
                        (0, K._)`${e} === true`,
                        () => t.assign(r, !0),
                        () => t.assign(r, (0, K._)`${r} || {}`).code((0, K._)`Object.assign(${r}, ${e})`),
                    );
                }),
            mergeToName: (t, e, r) =>
                t.if((0, K._)`${r} !== true`, () => {
                    e === !0 ? t.assign(r, !0) : (t.assign(r, (0, K._)`${r} || {}`), Cs(t, r, e));
                }),
            mergeValues: (t, e) => (t === !0 ? !0 : { ...t, ...e }),
            resultToName: xo,
        }),
        items: jo({
            mergeNames: (t, e, r) =>
                t.if((0, K._)`${r} !== true && ${e} !== undefined`, () =>
                    t.assign(r, (0, K._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`),
                ),
            mergeToName: (t, e, r) =>
                t.if((0, K._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, K._)`${r} > ${e} ? ${r} : ${e}`)),
            mergeValues: (t, e) => (t === !0 ? !0 : Math.max(t, e)),
            resultToName: (t, e) => t.var('items', e),
        }),
    };
    function xo(t, e) {
        if (e === !0) return t.var('props', !0);
        let r = t.var('props', (0, K._)`{}`);
        return e !== void 0 && Cs(t, r, e), r;
    }
    k.evaluatedPropsToName = xo;
    function Cs(t, e, r) {
        Object.keys(r).forEach((s) => t.assign((0, K._)`${e}${(0, K.getProperty)(s)}`, !0));
    }
    k.setEvaluated = Cs;
    var ko = {};
    function Uu(t, e) {
        return t.scopeValue('func', { ref: e, code: ko[e.code] || (ko[e.code] = new ju._Code(e.code)) });
    }
    k.useFunc = Uu;
    var Ts;
    (function (t) {
        (t[(t.Num = 0)] = 'Num'), (t[(t.Str = 1)] = 'Str');
    })(Ts || (k.Type = Ts = {}));
    function Lu(t, e, r) {
        if (t instanceof K.Name) {
            let s = e === Ts.Num;
            return r
                ? s
                    ? (0, K._)`"[" + ${t} + "]"`
                    : (0, K._)`"['" + ${t} + "']"`
                : s
                  ? (0, K._)`"/" + ${t}`
                  : (0, K._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
        }
        return r ? (0, K.getProperty)(t).toString() : `/${Ns(t)}`;
    }
    k.getErrorPath = Lu;
    function Fo(t, e, r = t.opts.strictSchema) {
        if (r) {
            if (((e = `strict mode: ${e}`), r === !0)) throw new Error(e);
            t.self.logger.warn(e);
        }
    }
    k.checkStrictMode = Fo;
});
var ke = R((As) => {
    'use strict';
    Object.defineProperty(As, '__esModule', { value: !0 });
    var te = j(),
        Ku = {
            data: new te.Name('data'),
            valCxt: new te.Name('valCxt'),
            instancePath: new te.Name('instancePath'),
            parentData: new te.Name('parentData'),
            parentDataProperty: new te.Name('parentDataProperty'),
            rootData: new te.Name('rootData'),
            dynamicAnchors: new te.Name('dynamicAnchors'),
            vErrors: new te.Name('vErrors'),
            errors: new te.Name('errors'),
            this: new te.Name('this'),
            self: new te.Name('self'),
            scope: new te.Name('scope'),
            json: new te.Name('json'),
            jsonPos: new te.Name('jsonPos'),
            jsonLen: new te.Name('jsonLen'),
            jsonPart: new te.Name('jsonPart'),
        };
    As.default = Ku;
});
var zt = R((re) => {
    'use strict';
    Object.defineProperty(re, '__esModule', { value: !0 });
    re.extendErrors =
        re.resetErrorsCount =
        re.reportExtraError =
        re.reportError =
        re.keyword$DataError =
        re.keywordError =
            void 0;
    var q = j(),
        Or = F(),
        ne = ke();
    re.keywordError = { message: ({ keyword: t }) => (0, q.str)`must pass "${t}" keyword validation` };
    re.keyword$DataError = {
        message: ({ keyword: t, schemaType: e }) =>
            e ? (0, q.str)`"${t}" keyword must be ${e} ($data)` : (0, q.str)`"${t}" keyword is invalid ($data)`,
    };
    function zu(t, e = re.keywordError, r, s) {
        let { it: n } = t,
            { gen: o, compositeRule: i, allErrors: a } = n,
            c = Lo(t, e, r);
        (s ?? (i || a)) ? Vo(o, c) : Uo(n, (0, q._)`[${c}]`);
    }
    re.reportError = zu;
    function Hu(t, e = re.keywordError, r) {
        let { it: s } = t,
            { gen: n, compositeRule: o, allErrors: i } = s,
            a = Lo(t, e, r);
        Vo(n, a), o || i || Uo(s, ne.default.vErrors);
    }
    re.reportExtraError = Hu;
    function Bu(t, e) {
        t.assign(ne.default.errors, e),
            t.if((0, q._)`${ne.default.vErrors} !== null`, () =>
                t.if(
                    e,
                    () => t.assign((0, q._)`${ne.default.vErrors}.length`, e),
                    () => t.assign(ne.default.vErrors, null),
                ),
            );
    }
    re.resetErrorsCount = Bu;
    function Wu({ gen: t, keyword: e, schemaValue: r, data: s, errsCount: n, it: o }) {
        if (n === void 0) throw new Error('ajv implementation error');
        let i = t.name('err');
        t.forRange('i', n, ne.default.errors, (a) => {
            t.const(i, (0, q._)`${ne.default.vErrors}[${a}]`),
                t.if((0, q._)`${i}.instancePath === undefined`, () =>
                    t.assign((0, q._)`${i}.instancePath`, (0, q.strConcat)(ne.default.instancePath, o.errorPath)),
                ),
                t.assign((0, q._)`${i}.schemaPath`, (0, q.str)`${o.errSchemaPath}/${e}`),
                o.opts.verbose && (t.assign((0, q._)`${i}.schema`, r), t.assign((0, q._)`${i}.data`, s));
        });
    }
    re.extendErrors = Wu;
    function Vo(t, e) {
        let r = t.const('err', e);
        t.if(
            (0, q._)`${ne.default.vErrors} === null`,
            () => t.assign(ne.default.vErrors, (0, q._)`[${r}]`),
            (0, q._)`${ne.default.vErrors}.push(${r})`,
        ),
            t.code((0, q._)`${ne.default.errors}++`);
    }
    function Uo(t, e) {
        let { gen: r, validateName: s, schemaEnv: n } = t;
        n.$async
            ? r.throw((0, q._)`new ${t.ValidationError}(${e})`)
            : (r.assign((0, q._)`${s}.errors`, e), r.return(!1));
    }
    var rt = {
        keyword: new q.Name('keyword'),
        schemaPath: new q.Name('schemaPath'),
        params: new q.Name('params'),
        propertyName: new q.Name('propertyName'),
        message: new q.Name('message'),
        schema: new q.Name('schema'),
        parentSchema: new q.Name('parentSchema'),
    };
    function Lo(t, e, r) {
        let { createErrors: s } = t.it;
        return s === !1 ? (0, q._)`{}` : Ju(t, e, r);
    }
    function Ju(t, e, r = {}) {
        let { gen: s, it: n } = t,
            o = [Yu(n, r), Qu(t, r)];
        return Xu(t, e, o), s.object(...o);
    }
    function Yu({ errorPath: t }, { instancePath: e }) {
        let r = e ? (0, q.str)`${t}${(0, Or.getErrorPath)(e, Or.Type.Str)}` : t;
        return [ne.default.instancePath, (0, q.strConcat)(ne.default.instancePath, r)];
    }
    function Qu({ keyword: t, it: { errSchemaPath: e } }, { schemaPath: r, parentSchema: s }) {
        let n = s ? e : (0, q.str)`${e}/${t}`;
        return r && (n = (0, q.str)`${n}${(0, Or.getErrorPath)(r, Or.Type.Str)}`), [rt.schemaPath, n];
    }
    function Xu(t, { params: e, message: r }, s) {
        let { keyword: n, data: o, schemaValue: i, it: a } = t,
            { opts: c, propertyName: u, topSchemaRef: l, schemaPath: f } = a;
        s.push([rt.keyword, n], [rt.params, typeof e == 'function' ? e(t) : e || (0, q._)`{}`]),
            c.messages && s.push([rt.message, typeof r == 'function' ? r(t) : r]),
            c.verbose && s.push([rt.schema, i], [rt.parentSchema, (0, q._)`${l}${f}`], [ne.default.data, o]),
            u && s.push([rt.propertyName, u]);
    }
});
var zo = R((ht) => {
    'use strict';
    Object.defineProperty(ht, '__esModule', { value: !0 });
    ht.boolOrEmptySchema = ht.topBoolOrEmptySchema = void 0;
    var Zu = zt(),
        el = j(),
        tl = ke(),
        rl = { message: 'boolean schema is false' };
    function sl(t) {
        let { gen: e, schema: r, validateName: s } = t;
        r === !1
            ? Ko(t, !1)
            : typeof r == 'object' && r.$async === !0
              ? e.return(tl.default.data)
              : (e.assign((0, el._)`${s}.errors`, null), e.return(!0));
    }
    ht.topBoolOrEmptySchema = sl;
    function nl(t, e) {
        let { gen: r, schema: s } = t;
        s === !1 ? (r.var(e, !1), Ko(t)) : r.var(e, !0);
    }
    ht.boolOrEmptySchema = nl;
    function Ko(t, e) {
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
        (0, Zu.reportError)(n, rl, void 0, e);
    }
});
var Ms = R((mt) => {
    'use strict';
    Object.defineProperty(mt, '__esModule', { value: !0 });
    mt.getRules = mt.isJSONType = void 0;
    var ol = ['string', 'number', 'integer', 'boolean', 'null', 'object', 'array'],
        il = new Set(ol);
    function al(t) {
        return typeof t == 'string' && il.has(t);
    }
    mt.isJSONType = al;
    function cl() {
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
    mt.getRules = cl;
});
var Gs = R((Le) => {
    'use strict';
    Object.defineProperty(Le, '__esModule', { value: !0 });
    Le.shouldUseRule = Le.shouldUseGroup = Le.schemaHasRulesForType = void 0;
    function ul({ schema: t, self: e }, r) {
        let s = e.RULES.types[r];
        return s && s !== !0 && Ho(t, s);
    }
    Le.schemaHasRulesForType = ul;
    function Ho(t, e) {
        return e.rules.some((r) => Bo(t, r));
    }
    Le.shouldUseGroup = Ho;
    function Bo(t, e) {
        var r;
        return (
            t[e.keyword] !== void 0 ||
            ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((s) => t[s] !== void 0))
        );
    }
    Le.shouldUseRule = Bo;
});
var Ht = R((se) => {
    'use strict';
    Object.defineProperty(se, '__esModule', { value: !0 });
    se.reportTypeError =
        se.checkDataTypes =
        se.checkDataType =
        se.coerceAndCheckDataType =
        se.getJSONTypes =
        se.getSchemaTypes =
        se.DataType =
            void 0;
    var ll = Ms(),
        dl = Gs(),
        fl = zt(),
        A = j(),
        Wo = F(),
        gt;
    (function (t) {
        (t[(t.Correct = 0)] = 'Correct'), (t[(t.Wrong = 1)] = 'Wrong');
    })(gt || (se.DataType = gt = {}));
    function pl(t) {
        let e = Jo(t.type);
        if (e.includes('null')) {
            if (t.nullable === !1) throw new Error('type: null contradicts nullable: false');
        } else {
            if (!e.length && t.nullable !== void 0) throw new Error('"nullable" cannot be used without "type"');
            t.nullable === !0 && e.push('null');
        }
        return e;
    }
    se.getSchemaTypes = pl;
    function Jo(t) {
        let e = Array.isArray(t) ? t : t ? [t] : [];
        if (e.every(ll.isJSONType)) return e;
        throw new Error(`type must be JSONType or JSONType[]: ${e.join(',')}`);
    }
    se.getJSONTypes = Jo;
    function hl(t, e) {
        let { gen: r, data: s, opts: n } = t,
            o = ml(e, n.coerceTypes),
            i = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, dl.schemaHasRulesForType)(t, e[0]));
        if (i) {
            let a = ks(e, s, n.strictNumbers, gt.Wrong);
            r.if(a, () => {
                o.length ? gl(t, e, o) : Is(t);
            });
        }
        return i;
    }
    se.coerceAndCheckDataType = hl;
    var Yo = new Set(['string', 'number', 'integer', 'boolean', 'null']);
    function ml(t, e) {
        return e ? t.filter((r) => Yo.has(r) || (e === 'array' && r === 'array')) : [];
    }
    function gl(t, e, r) {
        let { gen: s, data: n, opts: o } = t,
            i = s.let('dataType', (0, A._)`typeof ${n}`),
            a = s.let('coerced', (0, A._)`undefined`);
        o.coerceTypes === 'array' &&
            s.if((0, A._)`${i} == 'object' && Array.isArray(${n}) && ${n}.length == 1`, () =>
                s
                    .assign(n, (0, A._)`${n}[0]`)
                    .assign(i, (0, A._)`typeof ${n}`)
                    .if(ks(e, n, o.strictNumbers), () => s.assign(a, n)),
            ),
            s.if((0, A._)`${a} !== undefined`);
        for (let u of r) (Yo.has(u) || (u === 'array' && o.coerceTypes === 'array')) && c(u);
        s.else(),
            Is(t),
            s.endIf(),
            s.if((0, A._)`${a} !== undefined`, () => {
                s.assign(n, a), yl(t, a);
            });
        function c(u) {
            switch (u) {
                case 'string':
                    s.elseIf((0, A._)`${i} == "number" || ${i} == "boolean"`)
                        .assign(a, (0, A._)`"" + ${n}`)
                        .elseIf((0, A._)`${n} === null`)
                        .assign(a, (0, A._)`""`);
                    return;
                case 'number':
                    s.elseIf(
                        (0, A._)`${i} == "boolean" || ${n} === null
              || (${i} == "string" && ${n} && ${n} == +${n})`,
                    ).assign(a, (0, A._)`+${n}`);
                    return;
                case 'integer':
                    s.elseIf(
                        (0, A._)`${i} === "boolean" || ${n} === null
              || (${i} === "string" && ${n} && ${n} == +${n} && !(${n} % 1))`,
                    ).assign(a, (0, A._)`+${n}`);
                    return;
                case 'boolean':
                    s.elseIf((0, A._)`${n} === "false" || ${n} === 0 || ${n} === null`)
                        .assign(a, !1)
                        .elseIf((0, A._)`${n} === "true" || ${n} === 1`)
                        .assign(a, !0);
                    return;
                case 'null':
                    s.elseIf((0, A._)`${n} === "" || ${n} === 0 || ${n} === false`), s.assign(a, null);
                    return;
                case 'array':
                    s.elseIf(
                        (0, A._)`${i} === "string" || ${i} === "number"
              || ${i} === "boolean" || ${n} === null`,
                    ).assign(a, (0, A._)`[${n}]`);
            }
        }
    }
    function yl({ gen: t, parentData: e, parentDataProperty: r }, s) {
        t.if((0, A._)`${e} !== undefined`, () => t.assign((0, A._)`${e}[${r}]`, s));
    }
    function js(t, e, r, s = gt.Correct) {
        let n = s === gt.Correct ? A.operators.EQ : A.operators.NEQ,
            o;
        switch (t) {
            case 'null':
                return (0, A._)`${e} ${n} null`;
            case 'array':
                o = (0, A._)`Array.isArray(${e})`;
                break;
            case 'object':
                o = (0, A._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
                break;
            case 'integer':
                o = i((0, A._)`!(${e} % 1) && !isNaN(${e})`);
                break;
            case 'number':
                o = i();
                break;
            default:
                return (0, A._)`typeof ${e} ${n} ${t}`;
        }
        return s === gt.Correct ? o : (0, A.not)(o);
        function i(a = A.nil) {
            return (0, A.and)((0, A._)`typeof ${e} == "number"`, a, r ? (0, A._)`isFinite(${e})` : A.nil);
        }
    }
    se.checkDataType = js;
    function ks(t, e, r, s) {
        if (t.length === 1) return js(t[0], e, r, s);
        let n,
            o = (0, Wo.toHash)(t);
        if (o.array && o.object) {
            let i = (0, A._)`typeof ${e} != "object"`;
            (n = o.null ? i : (0, A._)`!${e} || ${i}`), delete o.null, delete o.array, delete o.object;
        } else n = A.nil;
        o.number && delete o.integer;
        for (let i in o) n = (0, A.and)(n, js(i, e, r, s));
        return n;
    }
    se.checkDataTypes = ks;
    var _l = {
        message: ({ schema: t }) => `must be ${t}`,
        params: ({ schema: t, schemaValue: e }) =>
            typeof t == 'string' ? (0, A._)`{type: ${t}}` : (0, A._)`{type: ${e}}`,
    };
    function Is(t) {
        let e = El(t);
        (0, fl.reportError)(e, _l);
    }
    se.reportTypeError = Is;
    function El(t) {
        let { gen: e, data: r, schema: s } = t,
            n = (0, Wo.schemaRefOrVal)(t, s, 'type');
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
var Xo = R((Tr) => {
    'use strict';
    Object.defineProperty(Tr, '__esModule', { value: !0 });
    Tr.assignDefaults = void 0;
    var yt = j(),
        wl = F();
    function vl(t, e) {
        let { properties: r, items: s } = t.schema;
        if (e === 'object' && r) for (let n in r) Qo(t, n, r[n].default);
        else e === 'array' && Array.isArray(s) && s.forEach((n, o) => Qo(t, o, n.default));
    }
    Tr.assignDefaults = vl;
    function Qo(t, e, r) {
        let { gen: s, compositeRule: n, data: o, opts: i } = t;
        if (r === void 0) return;
        let a = (0, yt._)`${o}${(0, yt.getProperty)(e)}`;
        if (n) {
            (0, wl.checkStrictMode)(t, `default is ignored for: ${a}`);
            return;
        }
        let c = (0, yt._)`${a} === undefined`;
        i.useDefaults === 'empty' && (c = (0, yt._)`${c} || ${a} === null || ${a} === ""`),
            s.if(c, (0, yt._)`${a} = ${(0, yt.stringify)(r)}`);
    }
});
var he = R((L) => {
    'use strict';
    Object.defineProperty(L, '__esModule', { value: !0 });
    L.validateUnion =
        L.validateArray =
        L.usePattern =
        L.callValidateCode =
        L.schemaProperties =
        L.allSchemaProperties =
        L.noPropertyInData =
        L.propertyInData =
        L.isOwnProperty =
        L.hasPropFunc =
        L.reportMissingProp =
        L.checkMissingProp =
        L.checkReportMissingProp =
            void 0;
    var z = j(),
        Ds = F(),
        Ke = ke(),
        $l = F();
    function bl(t, e) {
        let { gen: r, data: s, it: n } = t;
        r.if(xs(r, s, e, n.opts.ownProperties), () => {
            t.setParams({ missingProperty: (0, z._)`${e}` }, !0), t.error();
        });
    }
    L.checkReportMissingProp = bl;
    function Sl({ gen: t, data: e, it: { opts: r } }, s, n) {
        return (0, z.or)(...s.map((o) => (0, z.and)(xs(t, e, o, r.ownProperties), (0, z._)`${n} = ${o}`)));
    }
    L.checkMissingProp = Sl;
    function Pl(t, e) {
        t.setParams({ missingProperty: e }, !0), t.error();
    }
    L.reportMissingProp = Pl;
    function Zo(t) {
        return t.scopeValue('func', {
            ref: Object.prototype.hasOwnProperty,
            code: (0, z._)`Object.prototype.hasOwnProperty`,
        });
    }
    L.hasPropFunc = Zo;
    function qs(t, e, r) {
        return (0, z._)`${Zo(t)}.call(${e}, ${r})`;
    }
    L.isOwnProperty = qs;
    function Rl(t, e, r, s) {
        let n = (0, z._)`${e}${(0, z.getProperty)(r)} !== undefined`;
        return s ? (0, z._)`${n} && ${qs(t, e, r)}` : n;
    }
    L.propertyInData = Rl;
    function xs(t, e, r, s) {
        let n = (0, z._)`${e}${(0, z.getProperty)(r)} === undefined`;
        return s ? (0, z.or)(n, (0, z.not)(qs(t, e, r))) : n;
    }
    L.noPropertyInData = xs;
    function ei(t) {
        return t ? Object.keys(t).filter((e) => e !== '__proto__') : [];
    }
    L.allSchemaProperties = ei;
    function Ol(t, e) {
        return ei(e).filter((r) => !(0, Ds.alwaysValidSchema)(t, e[r]));
    }
    L.schemaProperties = Ol;
    function Tl(
        { schemaCode: t, data: e, it: { gen: r, topSchemaRef: s, schemaPath: n, errorPath: o }, it: i },
        a,
        c,
        u,
    ) {
        let l = u ? (0, z._)`${t}, ${e}, ${s}${n}` : e,
            f = [
                [Ke.default.instancePath, (0, z.strConcat)(Ke.default.instancePath, o)],
                [Ke.default.parentData, i.parentData],
                [Ke.default.parentDataProperty, i.parentDataProperty],
                [Ke.default.rootData, Ke.default.rootData],
            ];
        i.opts.dynamicRef && f.push([Ke.default.dynamicAnchors, Ke.default.dynamicAnchors]);
        let g = (0, z._)`${l}, ${r.object(...f)}`;
        return c !== z.nil ? (0, z._)`${a}.call(${c}, ${g})` : (0, z._)`${a}(${g})`;
    }
    L.callValidateCode = Tl;
    var Nl = (0, z._)`new RegExp`;
    function Cl({ gen: t, it: { opts: e } }, r) {
        let s = e.unicodeRegExp ? 'u' : '',
            { regExp: n } = e.code,
            o = n(r, s);
        return t.scopeValue('pattern', {
            key: o.toString(),
            ref: o,
            code: (0, z._)`${n.code === 'new RegExp' ? Nl : (0, $l.useFunc)(t, n)}(${r}, ${s})`,
        });
    }
    L.usePattern = Cl;
    function Al(t) {
        let { gen: e, data: r, keyword: s, it: n } = t,
            o = e.name('valid');
        if (n.allErrors) {
            let a = e.let('valid', !0);
            return i(() => e.assign(a, !1)), a;
        }
        return e.var(o, !0), i(() => e.break()), o;
        function i(a) {
            let c = e.const('len', (0, z._)`${r}.length`);
            e.forRange('i', 0, c, (u) => {
                t.subschema({ keyword: s, dataProp: u, dataPropType: Ds.Type.Num }, o), e.if((0, z.not)(o), a);
            });
        }
    }
    L.validateArray = Al;
    function Ml(t) {
        let { gen: e, schema: r, keyword: s, it: n } = t;
        if (!Array.isArray(r)) throw new Error('ajv implementation error');
        if (r.some((c) => (0, Ds.alwaysValidSchema)(n, c)) && !n.opts.unevaluated) return;
        let i = e.let('valid', !1),
            a = e.name('_valid');
        e.block(() =>
            r.forEach((c, u) => {
                let l = t.subschema({ keyword: s, schemaProp: u, compositeRule: !0 }, a);
                e.assign(i, (0, z._)`${i} || ${a}`), t.mergeValidEvaluated(l, a) || e.if((0, z.not)(i));
            }),
        ),
            t.result(
                i,
                () => t.reset(),
                () => t.error(!0),
            );
    }
    L.validateUnion = Ml;
});
var si = R((Oe) => {
    'use strict';
    Object.defineProperty(Oe, '__esModule', { value: !0 });
    Oe.validateKeywordUsage = Oe.validSchemaType = Oe.funcKeywordCode = Oe.macroKeywordCode = void 0;
    var oe = j(),
        st = ke(),
        Gl = he(),
        jl = zt();
    function kl(t, e) {
        let { gen: r, keyword: s, schema: n, parentSchema: o, it: i } = t,
            a = e.macro.call(i.self, n, o, i),
            c = ri(r, s, a);
        i.opts.validateSchema !== !1 && i.self.validateSchema(a, !0);
        let u = r.name('valid');
        t.subschema(
            {
                schema: a,
                schemaPath: oe.nil,
                errSchemaPath: `${i.errSchemaPath}/${s}`,
                topSchemaRef: c,
                compositeRule: !0,
            },
            u,
        ),
            t.pass(u, () => t.error(!0));
    }
    Oe.macroKeywordCode = kl;
    function Il(t, e) {
        var r;
        let { gen: s, keyword: n, schema: o, parentSchema: i, $data: a, it: c } = t;
        ql(c, e);
        let u = !a && e.compile ? e.compile.call(c.self, o, i, c) : e.validate,
            l = ri(s, n, u),
            f = s.let('valid');
        t.block$data(f, g), t.ok((r = e.valid) !== null && r !== void 0 ? r : f);
        function g() {
            if (e.errors === !1) m(), e.modifying && ti(t), $(() => t.error());
            else {
                let _ = e.async ? w() : h();
                e.modifying && ti(t), $(() => Dl(t, _));
            }
        }
        function w() {
            let _ = s.let('ruleErrs', null);
            return (
                s.try(
                    () => m((0, oe._)`await `),
                    (S) =>
                        s.assign(f, !1).if(
                            (0, oe._)`${S} instanceof ${c.ValidationError}`,
                            () => s.assign(_, (0, oe._)`${S}.errors`),
                            () => s.throw(S),
                        ),
                ),
                _
            );
        }
        function h() {
            let _ = (0, oe._)`${l}.errors`;
            return s.assign(_, null), m(oe.nil), _;
        }
        function m(_ = e.async ? (0, oe._)`await ` : oe.nil) {
            let S = c.opts.passContext ? st.default.this : st.default.self,
                P = !(('compile' in e && !a) || e.schema === !1);
            s.assign(f, (0, oe._)`${_}${(0, Gl.callValidateCode)(t, l, S, P)}`, e.modifying);
        }
        function $(_) {
            var S;
            s.if((0, oe.not)((S = e.valid) !== null && S !== void 0 ? S : f), _);
        }
    }
    Oe.funcKeywordCode = Il;
    function ti(t) {
        let { gen: e, data: r, it: s } = t;
        e.if(s.parentData, () => e.assign(r, (0, oe._)`${s.parentData}[${s.parentDataProperty}]`));
    }
    function Dl(t, e) {
        let { gen: r } = t;
        r.if(
            (0, oe._)`Array.isArray(${e})`,
            () => {
                r
                    .assign(
                        st.default.vErrors,
                        (0, oe._)`${st.default.vErrors} === null ? ${e} : ${st.default.vErrors}.concat(${e})`,
                    )
                    .assign(st.default.errors, (0, oe._)`${st.default.vErrors}.length`),
                    (0, jl.extendErrors)(t);
            },
            () => t.error(),
        );
    }
    function ql({ schemaEnv: t }, e) {
        if (e.async && !t.$async) throw new Error('async keyword in sync schema');
    }
    function ri(t, e, r) {
        if (r === void 0) throw new Error(`keyword "${e}" failed to compile`);
        return t.scopeValue('keyword', typeof r == 'function' ? { ref: r } : { ref: r, code: (0, oe.stringify)(r) });
    }
    function xl(t, e, r = !1) {
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
    Oe.validSchemaType = xl;
    function Fl({ schema: t, opts: e, self: r, errSchemaPath: s }, n, o) {
        if (Array.isArray(n.keyword) ? !n.keyword.includes(o) : n.keyword !== o)
            throw new Error('ajv implementation error');
        let i = n.dependencies;
        if (i?.some((a) => !Object.prototype.hasOwnProperty.call(t, a)))
            throw new Error(`parent schema must have dependencies of ${o}: ${i.join(',')}`);
        if (n.validateSchema && !n.validateSchema(t[o])) {
            let c = `keyword "${o}" value is invalid at path "${s}": ${r.errorsText(n.validateSchema.errors)}`;
            if (e.validateSchema === 'log') r.logger.error(c);
            else throw new Error(c);
        }
    }
    Oe.validateKeywordUsage = Fl;
});
var oi = R((ze) => {
    'use strict';
    Object.defineProperty(ze, '__esModule', { value: !0 });
    ze.extendSubschemaMode = ze.extendSubschemaData = ze.getSubschema = void 0;
    var Te = j(),
        ni = F();
    function Vl(t, { keyword: e, schemaProp: r, schema: s, schemaPath: n, errSchemaPath: o, topSchemaRef: i }) {
        if (e !== void 0 && s !== void 0) throw new Error('both "keyword" and "schema" passed, only one allowed');
        if (e !== void 0) {
            let a = t.schema[e];
            return r === void 0
                ? {
                      schema: a,
                      schemaPath: (0, Te._)`${t.schemaPath}${(0, Te.getProperty)(e)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}`,
                  }
                : {
                      schema: a[r],
                      schemaPath: (0, Te._)`${t.schemaPath}${(0, Te.getProperty)(e)}${(0, Te.getProperty)(r)}`,
                      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, ni.escapeFragment)(r)}`,
                  };
        }
        if (s !== void 0) {
            if (n === void 0 || o === void 0 || i === void 0)
                throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return { schema: s, schemaPath: n, topSchemaRef: i, errSchemaPath: o };
        }
        throw new Error('either "keyword" or "schema" must be passed');
    }
    ze.getSubschema = Vl;
    function Ul(t, e, { dataProp: r, dataPropType: s, data: n, dataTypes: o, propertyName: i }) {
        if (n !== void 0 && r !== void 0) throw new Error('both "data" and "dataProp" passed, only one allowed');
        let { gen: a } = e;
        if (r !== void 0) {
            let { errorPath: u, dataPathArr: l, opts: f } = e,
                g = a.let('data', (0, Te._)`${e.data}${(0, Te.getProperty)(r)}`, !0);
            c(g),
                (t.errorPath = (0, Te.str)`${u}${(0, ni.getErrorPath)(r, s, f.jsPropertySyntax)}`),
                (t.parentDataProperty = (0, Te._)`${r}`),
                (t.dataPathArr = [...l, t.parentDataProperty]);
        }
        if (n !== void 0) {
            let u = n instanceof Te.Name ? n : a.let('data', n, !0);
            c(u), i !== void 0 && (t.propertyName = i);
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
    ze.extendSubschemaData = Ul;
    function Ll(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: s, createErrors: n, allErrors: o }) {
        s !== void 0 && (t.compositeRule = s),
            n !== void 0 && (t.createErrors = n),
            o !== void 0 && (t.allErrors = o),
            (t.jtdDiscriminator = e),
            (t.jtdMetadata = r);
    }
    ze.extendSubschemaMode = Ll;
});
var Fs = R((Qy, ii) => {
    'use strict';
    ii.exports = function t(e, r) {
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
                var i = o[n];
                if (!t(e[i], r[i])) return !1;
            }
            return !0;
        }
        return e !== e && r !== r;
    };
});
var ci = R((Xy, ai) => {
    'use strict';
    var He = (ai.exports = function (t, e, r) {
        typeof e == 'function' && ((r = e), (e = {})), (r = e.cb || r);
        var s = typeof r == 'function' ? r : r.pre || function () {},
            n = r.post || function () {};
        Nr(e, s, n, t, '', t);
    });
    He.keywords = {
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
    He.arrayKeywords = { items: !0, allOf: !0, anyOf: !0, oneOf: !0 };
    He.propsKeywords = { $defs: !0, definitions: !0, properties: !0, patternProperties: !0, dependencies: !0 };
    He.skipKeywords = {
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
    function Nr(t, e, r, s, n, o, i, a, c, u) {
        if (s && typeof s == 'object' && !Array.isArray(s)) {
            e(s, n, o, i, a, c, u);
            for (var l in s) {
                var f = s[l];
                if (Array.isArray(f)) {
                    if (l in He.arrayKeywords)
                        for (var g = 0; g < f.length; g++) Nr(t, e, r, f[g], `${n}/${l}/${g}`, o, n, l, s, g);
                } else if (l in He.propsKeywords) {
                    if (f && typeof f == 'object')
                        for (var w in f) Nr(t, e, r, f[w], `${n}/${l}/${Kl(w)}`, o, n, l, s, w);
                } else
                    (l in He.keywords || (t.allKeys && !(l in He.skipKeywords))) &&
                        Nr(t, e, r, f, `${n}/${l}`, o, n, l, s);
            }
            r(s, n, o, i, a, c, u);
        }
    }
    function Kl(t) {
        return t.replace(/~/g, '~0').replace(/\//g, '~1');
    }
});
var Bt = R((ce) => {
    'use strict';
    Object.defineProperty(ce, '__esModule', { value: !0 });
    ce.getSchemaRefs = ce.resolveUrl = ce.normalizeId = ce._getFullPath = ce.getFullPath = ce.inlineRef = void 0;
    var zl = F(),
        Hl = Fs(),
        Bl = ci(),
        Wl = new Set([
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
    function Jl(t, e = !0) {
        return typeof t == 'boolean' ? !0 : e === !0 ? !Vs(t) : e ? ui(t) <= e : !1;
    }
    ce.inlineRef = Jl;
    var Yl = new Set(['$ref', '$recursiveRef', '$recursiveAnchor', '$dynamicRef', '$dynamicAnchor']);
    function Vs(t) {
        for (let e in t) {
            if (Yl.has(e)) return !0;
            let r = t[e];
            if ((Array.isArray(r) && r.some(Vs)) || (typeof r == 'object' && Vs(r))) return !0;
        }
        return !1;
    }
    function ui(t) {
        let e = 0;
        for (let r in t) {
            if (r === '$ref') return 1 / 0;
            if (
                (e++,
                !Wl.has(r) && (typeof t[r] == 'object' && (0, zl.eachItem)(t[r], (s) => (e += ui(s))), e === 1 / 0))
            )
                return 1 / 0;
        }
        return e;
    }
    function li(t, e = '', r) {
        r !== !1 && (e = _t(e));
        let s = t.parse(e);
        return di(t, s);
    }
    ce.getFullPath = li;
    function di(t, e) {
        return `${t.serialize(e).split('#')[0]}#`;
    }
    ce._getFullPath = di;
    var Ql = /#\/?$/;
    function _t(t) {
        return t ? t.replace(Ql, '') : '';
    }
    ce.normalizeId = _t;
    function Xl(t, e, r) {
        return (r = _t(r)), t.resolve(e, r);
    }
    ce.resolveUrl = Xl;
    var Zl = /^[a-z_][-a-z0-9._]*$/i;
    function ed(t, e) {
        if (typeof t == 'boolean') return {};
        let { schemaId: r, uriResolver: s } = this.opts,
            n = _t(t[r] || e),
            o = { '': n },
            i = li(s, n, !1),
            a = {},
            c = new Set();
        return (
            Bl(t, { allKeys: !0 }, (f, g, w, h) => {
                if (h === void 0) return;
                let m = i + g,
                    $ = o[h];
                typeof f[r] == 'string' && ($ = _.call(this, f[r])),
                    S.call(this, f.$anchor),
                    S.call(this, f.$dynamicAnchor),
                    (o[g] = $);
                function _(P) {
                    let E = this.opts.uriResolver.resolve;
                    if (((P = _t($ ? E($, P) : P)), c.has(P))) throw l(P);
                    c.add(P);
                    let y = this.refs[P];
                    return (
                        typeof y == 'string' && (y = this.refs[y]),
                        typeof y == 'object'
                            ? u(f, y.schema, P)
                            : P !== _t(m) && (P[0] === '#' ? (u(f, a[P], P), (a[P] = f)) : (this.refs[P] = m)),
                        P
                    );
                }
                function S(P) {
                    if (typeof P == 'string') {
                        if (!Zl.test(P)) throw new Error(`invalid anchor "${P}"`);
                        _.call(this, `#${P}`);
                    }
                }
            }),
            a
        );
        function u(f, g, w) {
            if (g !== void 0 && !Hl(f, g)) throw l(w);
        }
        function l(f) {
            return new Error(`reference "${f}" resolves to more than one schema`);
        }
    }
    ce.getSchemaRefs = ed;
});
var Yt = R((Be) => {
    'use strict';
    Object.defineProperty(Be, '__esModule', { value: !0 });
    Be.getData = Be.KeywordCxt = Be.validateFunctionCode = void 0;
    var gi = zo(),
        fi = Ht(),
        Ls = Gs(),
        Cr = Ht(),
        td = Xo(),
        Jt = si(),
        Us = oi(),
        T = j(),
        C = ke(),
        rd = Bt(),
        Ie = F(),
        Wt = zt();
    function sd(t) {
        if (Ei(t) && (wi(t), _i(t))) {
            id(t);
            return;
        }
        yi(t, () => (0, gi.topBoolOrEmptySchema)(t));
    }
    Be.validateFunctionCode = sd;
    function yi({ gen: t, validateName: e, schema: r, schemaEnv: s, opts: n }, o) {
        n.code.es5
            ? t.func(e, (0, T._)`${C.default.data}, ${C.default.valCxt}`, s.$async, () => {
                  t.code((0, T._)`"use strict"; ${pi(r, n)}`), od(t, n), t.code(o);
              })
            : t.func(e, (0, T._)`${C.default.data}, ${nd(n)}`, s.$async, () => t.code(pi(r, n)).code(o));
    }
    function nd(t) {
        return (0,
        T._)`{${C.default.instancePath}="", ${C.default.parentData}, ${C.default.parentDataProperty}, ${C.default.rootData}=${C.default.data}${t.dynamicRef ? (0, T._)`, ${C.default.dynamicAnchors}={}` : T.nil}}={}`;
    }
    function od(t, e) {
        t.if(
            C.default.valCxt,
            () => {
                t.var(C.default.instancePath, (0, T._)`${C.default.valCxt}.${C.default.instancePath}`),
                    t.var(C.default.parentData, (0, T._)`${C.default.valCxt}.${C.default.parentData}`),
                    t.var(C.default.parentDataProperty, (0, T._)`${C.default.valCxt}.${C.default.parentDataProperty}`),
                    t.var(C.default.rootData, (0, T._)`${C.default.valCxt}.${C.default.rootData}`),
                    e.dynamicRef &&
                        t.var(C.default.dynamicAnchors, (0, T._)`${C.default.valCxt}.${C.default.dynamicAnchors}`);
            },
            () => {
                t.var(C.default.instancePath, (0, T._)`""`),
                    t.var(C.default.parentData, (0, T._)`undefined`),
                    t.var(C.default.parentDataProperty, (0, T._)`undefined`),
                    t.var(C.default.rootData, C.default.data),
                    e.dynamicRef && t.var(C.default.dynamicAnchors, (0, T._)`{}`);
            },
        );
    }
    function id(t) {
        let { schema: e, opts: r, gen: s } = t;
        yi(t, () => {
            r.$comment && e.$comment && $i(t),
                dd(t),
                s.let(C.default.vErrors, null),
                s.let(C.default.errors, 0),
                r.unevaluated && ad(t),
                vi(t),
                hd(t);
        });
    }
    function ad(t) {
        let { gen: e, validateName: r } = t;
        (t.evaluated = e.const('evaluated', (0, T._)`${r}.evaluated`)),
            e.if((0, T._)`${t.evaluated}.dynamicProps`, () =>
                e.assign((0, T._)`${t.evaluated}.props`, (0, T._)`undefined`),
            ),
            e.if((0, T._)`${t.evaluated}.dynamicItems`, () =>
                e.assign((0, T._)`${t.evaluated}.items`, (0, T._)`undefined`),
            );
    }
    function pi(t, e) {
        let r = typeof t == 'object' && t[e.schemaId];
        return r && (e.code.source || e.code.process) ? (0, T._)`/*# sourceURL=${r} */` : T.nil;
    }
    function cd(t, e) {
        if (Ei(t) && (wi(t), _i(t))) {
            ud(t, e);
            return;
        }
        (0, gi.boolOrEmptySchema)(t, e);
    }
    function _i({ schema: t, self: e }) {
        if (typeof t == 'boolean') return !t;
        for (let r in t) if (e.RULES.all[r]) return !0;
        return !1;
    }
    function Ei(t) {
        return typeof t.schema != 'boolean';
    }
    function ud(t, e) {
        let { schema: r, gen: s, opts: n } = t;
        n.$comment && r.$comment && $i(t), fd(t), pd(t);
        let o = s.const('_errs', C.default.errors);
        vi(t, o), s.var(e, (0, T._)`${o} === ${C.default.errors}`);
    }
    function wi(t) {
        (0, Ie.checkUnknownRules)(t), ld(t);
    }
    function vi(t, e) {
        if (t.opts.jtd) return hi(t, [], !1, e);
        let r = (0, fi.getSchemaTypes)(t.schema),
            s = (0, fi.coerceAndCheckDataType)(t, r);
        hi(t, r, !s, e);
    }
    function ld(t) {
        let { schema: e, errSchemaPath: r, opts: s, self: n } = t;
        e.$ref &&
            s.ignoreKeywordsWithRef &&
            (0, Ie.schemaHasRulesButRef)(e, n.RULES) &&
            n.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
    }
    function dd(t) {
        let { schema: e, opts: r } = t;
        e.default !== void 0 &&
            r.useDefaults &&
            r.strictSchema &&
            (0, Ie.checkStrictMode)(t, 'default is ignored in the schema root');
    }
    function fd(t) {
        let e = t.schema[t.opts.schemaId];
        e && (t.baseId = (0, rd.resolveUrl)(t.opts.uriResolver, t.baseId, e));
    }
    function pd(t) {
        if (t.schema.$async && !t.schemaEnv.$async) throw new Error('async schema in sync schema');
    }
    function $i({ gen: t, schemaEnv: e, schema: r, errSchemaPath: s, opts: n }) {
        let o = r.$comment;
        if (n.$comment === !0) t.code((0, T._)`${C.default.self}.logger.log(${o})`);
        else if (typeof n.$comment == 'function') {
            let i = (0, T.str)`${s}/$comment`,
                a = t.scopeValue('root', { ref: e.root });
            t.code((0, T._)`${C.default.self}.opts.$comment(${o}, ${i}, ${a}.schema)`);
        }
    }
    function hd(t) {
        let { gen: e, schemaEnv: r, validateName: s, ValidationError: n, opts: o } = t;
        r.$async
            ? e.if(
                  (0, T._)`${C.default.errors} === 0`,
                  () => e.return(C.default.data),
                  () => e.throw((0, T._)`new ${n}(${C.default.vErrors})`),
              )
            : (e.assign((0, T._)`${s}.errors`, C.default.vErrors),
              o.unevaluated && md(t),
              e.return((0, T._)`${C.default.errors} === 0`));
    }
    function md({ gen: t, evaluated: e, props: r, items: s }) {
        r instanceof T.Name && t.assign((0, T._)`${e}.props`, r),
            s instanceof T.Name && t.assign((0, T._)`${e}.items`, s);
    }
    function hi(t, e, r, s) {
        let { gen: n, schema: o, data: i, allErrors: a, opts: c, self: u } = t,
            { RULES: l } = u;
        if (o.$ref && (c.ignoreKeywordsWithRef || !(0, Ie.schemaHasRulesButRef)(o, l))) {
            n.block(() => Si(t, '$ref', l.all.$ref.definition));
            return;
        }
        c.jtd || gd(t, e),
            n.block(() => {
                for (let g of l.rules) f(g);
                f(l.post);
            });
        function f(g) {
            (0, Ls.shouldUseGroup)(o, g) &&
                (g.type
                    ? (n.if((0, Cr.checkDataType)(g.type, i, c.strictNumbers)),
                      mi(t, g),
                      e.length === 1 && e[0] === g.type && r && (n.else(), (0, Cr.reportTypeError)(t)),
                      n.endIf())
                    : mi(t, g),
                a || n.if((0, T._)`${C.default.errors} === ${s || 0}`));
        }
    }
    function mi(t, e) {
        let {
            gen: r,
            schema: s,
            opts: { useDefaults: n },
        } = t;
        n && (0, td.assignDefaults)(t, e.type),
            r.block(() => {
                for (let o of e.rules) (0, Ls.shouldUseRule)(s, o) && Si(t, o.keyword, o.definition, e.type);
            });
    }
    function gd(t, e) {
        t.schemaEnv.meta || !t.opts.strictTypes || (yd(t, e), t.opts.allowUnionTypes || _d(t, e), Ed(t, t.dataTypes));
    }
    function yd(t, e) {
        if (e.length) {
            if (!t.dataTypes.length) {
                t.dataTypes = e;
                return;
            }
            e.forEach((r) => {
                bi(t.dataTypes, r) || Ks(t, `type "${r}" not allowed by context "${t.dataTypes.join(',')}"`);
            }),
                vd(t, e);
        }
    }
    function _d(t, e) {
        e.length > 1 &&
            !(e.length === 2 && e.includes('null')) &&
            Ks(t, 'use allowUnionTypes to allow union type keyword');
    }
    function Ed(t, e) {
        let r = t.self.RULES.all;
        for (let s in r) {
            let n = r[s];
            if (typeof n == 'object' && (0, Ls.shouldUseRule)(t.schema, n)) {
                let { type: o } = n.definition;
                o.length && !o.some((i) => wd(e, i)) && Ks(t, `missing type "${o.join(',')}" for keyword "${s}"`);
            }
        }
    }
    function wd(t, e) {
        return t.includes(e) || (e === 'number' && t.includes('integer'));
    }
    function bi(t, e) {
        return t.includes(e) || (e === 'integer' && t.includes('number'));
    }
    function vd(t, e) {
        let r = [];
        for (let s of t.dataTypes) bi(e, s) ? r.push(s) : e.includes('integer') && s === 'number' && r.push('integer');
        t.dataTypes = r;
    }
    function Ks(t, e) {
        let r = t.schemaEnv.baseId + t.errSchemaPath;
        (e += ` at "${r}" (strictTypes)`), (0, Ie.checkStrictMode)(t, e, t.opts.strictTypes);
    }
    var Ar = class {
        constructor(e, r, s) {
            if (
                ((0, Jt.validateKeywordUsage)(e, r, s),
                (this.gen = e.gen),
                (this.allErrors = e.allErrors),
                (this.keyword = s),
                (this.data = e.data),
                (this.schema = e.schema[s]),
                (this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data),
                (this.schemaValue = (0, Ie.schemaRefOrVal)(e, this.schema, s, this.$data)),
                (this.schemaType = r.schemaType),
                (this.parentSchema = e.schema),
                (this.params = {}),
                (this.it = e),
                (this.def = r),
                this.$data)
            )
                this.schemaCode = e.gen.const('vSchema', Pi(this.$data, e));
            else if (
                ((this.schemaCode = this.schemaValue),
                !(0, Jt.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
            )
                throw new Error(`${s} value must be ${JSON.stringify(r.schemaType)}`);
            ('code' in r ? r.trackErrors : r.errors !== !1) &&
                (this.errsCount = e.gen.const('_errs', C.default.errors));
        }
        result(e, r, s) {
            this.failResult((0, T.not)(e), r, s);
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
            this.failResult((0, T.not)(e), void 0, r);
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
            this.fail((0, T._)`${r} !== undefined && (${(0, T.or)(this.invalid$data(), e)})`);
        }
        error(e, r, s) {
            if (r) {
                this.setParams(r), this._error(e, s), this.setParams({});
                return;
            }
            this._error(e, s);
        }
        _error(e, r) {
            (e ? Wt.reportExtraError : Wt.reportError)(this, this.def.error, r);
        }
        $dataError() {
            (0, Wt.reportError)(this, this.def.$dataError || Wt.keyword$DataError);
        }
        reset() {
            if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
            (0, Wt.resetErrorsCount)(this.gen, this.errsCount);
        }
        ok(e) {
            this.allErrors || this.gen.if(e);
        }
        setParams(e, r) {
            r ? Object.assign(this.params, e) : (this.params = e);
        }
        block$data(e, r, s = T.nil) {
            this.gen.block(() => {
                this.check$data(e, s), r();
            });
        }
        check$data(e = T.nil, r = T.nil) {
            if (!this.$data) return;
            let { gen: s, schemaCode: n, schemaType: o, def: i } = this;
            s.if((0, T.or)((0, T._)`${n} === undefined`, r)),
                e !== T.nil && s.assign(e, !0),
                (o.length || i.validateSchema) &&
                    (s.elseIf(this.invalid$data()), this.$dataError(), e !== T.nil && s.assign(e, !1)),
                s.else();
        }
        invalid$data() {
            let { gen: e, schemaCode: r, schemaType: s, def: n, it: o } = this;
            return (0, T.or)(i(), a());
            function i() {
                if (s.length) {
                    if (!(r instanceof T.Name)) throw new Error('ajv implementation error');
                    let c = Array.isArray(s) ? s : [s];
                    return (0, T._)`${(0, Cr.checkDataTypes)(c, r, o.opts.strictNumbers, Cr.DataType.Wrong)}`;
                }
                return T.nil;
            }
            function a() {
                if (n.validateSchema) {
                    let c = e.scopeValue('validate$data', { ref: n.validateSchema });
                    return (0, T._)`!${c}(${r})`;
                }
                return T.nil;
            }
        }
        subschema(e, r) {
            let s = (0, Us.getSubschema)(this.it, e);
            (0, Us.extendSubschemaData)(s, this.it, e), (0, Us.extendSubschemaMode)(s, e);
            let n = { ...this.it, ...s, items: void 0, props: void 0 };
            return cd(n, r), n;
        }
        mergeEvaluated(e, r) {
            let { it: s, gen: n } = this;
            s.opts.unevaluated &&
                (s.props !== !0 && e.props !== void 0 && (s.props = Ie.mergeEvaluated.props(n, e.props, s.props, r)),
                s.items !== !0 && e.items !== void 0 && (s.items = Ie.mergeEvaluated.items(n, e.items, s.items, r)));
        }
        mergeValidEvaluated(e, r) {
            let { it: s, gen: n } = this;
            if (s.opts.unevaluated && (s.props !== !0 || s.items !== !0))
                return n.if(r, () => this.mergeEvaluated(e, T.Name)), !0;
        }
    };
    Be.KeywordCxt = Ar;
    function Si(t, e, r, s) {
        let n = new Ar(t, r, e);
        'code' in r
            ? r.code(n, s)
            : n.$data && r.validate
              ? (0, Jt.funcKeywordCode)(n, r)
              : 'macro' in r
                ? (0, Jt.macroKeywordCode)(n, r)
                : (r.compile || r.validate) && (0, Jt.funcKeywordCode)(n, r);
    }
    var $d = /^\/(?:[^~]|~0|~1)*$/,
        bd = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function Pi(t, { dataLevel: e, dataNames: r, dataPathArr: s }) {
        let n, o;
        if (t === '') return C.default.rootData;
        if (t[0] === '/') {
            if (!$d.test(t)) throw new Error(`Invalid JSON-pointer: ${t}`);
            (n = t), (o = C.default.rootData);
        } else {
            let u = bd.exec(t);
            if (!u) throw new Error(`Invalid JSON-pointer: ${t}`);
            let l = +u[1];
            if (((n = u[2]), n === '#')) {
                if (l >= e) throw new Error(c('property/index', l));
                return s[e - l];
            }
            if (l > e) throw new Error(c('data', l));
            if (((o = r[e - l]), !n)) return o;
        }
        let i = o,
            a = n.split('/');
        for (let u of a)
            u &&
                ((o = (0, T._)`${o}${(0, T.getProperty)((0, Ie.unescapeJsonPointer)(u))}`),
                (i = (0, T._)`${i} && ${o}`));
        return i;
        function c(u, l) {
            return `Cannot access ${u} ${l} levels up, current level is ${e}`;
        }
    }
    Be.getData = Pi;
});
var Mr = R((Hs) => {
    'use strict';
    Object.defineProperty(Hs, '__esModule', { value: !0 });
    var zs = class extends Error {
        constructor(e) {
            super('validation failed'), (this.errors = e), (this.ajv = this.validation = !0);
        }
    };
    Hs.default = zs;
});
var Qt = R((Js) => {
    'use strict';
    Object.defineProperty(Js, '__esModule', { value: !0 });
    var Bs = Bt(),
        Ws = class extends Error {
            constructor(e, r, s, n) {
                super(n || `can't resolve reference ${s} from id ${r}`),
                    (this.missingRef = (0, Bs.resolveUrl)(e, r, s)),
                    (this.missingSchema = (0, Bs.normalizeId)((0, Bs.getFullPath)(e, this.missingRef)));
            }
        };
    Js.default = Ws;
});
var jr = R((me) => {
    'use strict';
    Object.defineProperty(me, '__esModule', { value: !0 });
    me.resolveSchema = me.getCompilingSchema = me.resolveRef = me.compileSchema = me.SchemaEnv = void 0;
    var _e = j(),
        Sd = Mr(),
        nt = ke(),
        Ee = Bt(),
        Ri = F(),
        Pd = Yt(),
        Et = class {
            constructor(e) {
                var r;
                (this.refs = {}), (this.dynamicAnchors = {});
                let s;
                typeof e.schema == 'object' && (s = e.schema),
                    (this.schema = e.schema),
                    (this.schemaId = e.schemaId),
                    (this.root = e.root || this),
                    (this.baseId =
                        (r = e.baseId) !== null && r !== void 0 ? r : (0, Ee.normalizeId)(s?.[e.schemaId || '$id'])),
                    (this.schemaPath = e.schemaPath),
                    (this.localRefs = e.localRefs),
                    (this.meta = e.meta),
                    (this.$async = s?.$async),
                    (this.refs = {});
            }
        };
    me.SchemaEnv = Et;
    function Qs(t) {
        let e = Oi.call(this, t);
        if (e) return e;
        let r = (0, Ee.getFullPath)(this.opts.uriResolver, t.root.baseId),
            { es5: s, lines: n } = this.opts.code,
            { ownProperties: o } = this.opts,
            i = new _e.CodeGen(this.scope, { es5: s, lines: n, ownProperties: o }),
            a;
        t.$async &&
            (a = i.scopeValue('Error', {
                ref: Sd.default,
                code: (0, _e._)`require("ajv/dist/runtime/validation_error").default`,
            }));
        let c = i.scopeName('validate');
        t.validateName = c;
        let u = {
                gen: i,
                allErrors: this.opts.allErrors,
                data: nt.default.data,
                parentData: nt.default.parentData,
                parentDataProperty: nt.default.parentDataProperty,
                dataNames: [nt.default.data],
                dataPathArr: [_e.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set(),
                topSchemaRef: i.scopeValue(
                    'schema',
                    this.opts.code.source === !0
                        ? { ref: t.schema, code: (0, _e.stringify)(t.schema) }
                        : { ref: t.schema },
                ),
                validateName: c,
                ValidationError: a,
                schema: t.schema,
                schemaEnv: t,
                rootId: r,
                baseId: t.baseId || r,
                schemaPath: _e.nil,
                errSchemaPath: t.schemaPath || (this.opts.jtd ? '' : '#'),
                errorPath: (0, _e._)`""`,
                opts: this.opts,
                self: this,
            },
            l;
        try {
            this._compilations.add(t), (0, Pd.validateFunctionCode)(u), i.optimize(this.opts.code.optimize);
            let f = i.toString();
            (l = `${i.scopeRefs(nt.default.scope)}return ${f}`),
                this.opts.code.process && (l = this.opts.code.process(l, t));
            let w = new Function(`${nt.default.self}`, `${nt.default.scope}`, l)(this, this.scope.get());
            if (
                (this.scope.value(c, { ref: w }),
                (w.errors = null),
                (w.schema = t.schema),
                (w.schemaEnv = t),
                t.$async && (w.$async = !0),
                this.opts.code.source === !0 &&
                    (w.source = { validateName: c, validateCode: f, scopeValues: i._values }),
                this.opts.unevaluated)
            ) {
                let { props: h, items: m } = u;
                (w.evaluated = {
                    props: h instanceof _e.Name ? void 0 : h,
                    items: m instanceof _e.Name ? void 0 : m,
                    dynamicProps: h instanceof _e.Name,
                    dynamicItems: m instanceof _e.Name,
                }),
                    w.source && (w.source.evaluated = (0, _e.stringify)(w.evaluated));
            }
            return (t.validate = w), t;
        } catch (f) {
            throw (
                (delete t.validate,
                delete t.validateName,
                l && this.logger.error('Error compiling schema, function code:', l),
                f)
            );
        } finally {
            this._compilations.delete(t);
        }
    }
    me.compileSchema = Qs;
    function Rd(t, e, r) {
        var s;
        r = (0, Ee.resolveUrl)(this.opts.uriResolver, e, r);
        let n = t.refs[r];
        if (n) return n;
        let o = Nd.call(this, t, r);
        if (o === void 0) {
            let i = (s = t.localRefs) === null || s === void 0 ? void 0 : s[r],
                { schemaId: a } = this.opts;
            i && (o = new Et({ schema: i, schemaId: a, root: t, baseId: e }));
        }
        if (o !== void 0) return (t.refs[r] = Od.call(this, o));
    }
    me.resolveRef = Rd;
    function Od(t) {
        return (0, Ee.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : Qs.call(this, t);
    }
    function Oi(t) {
        for (let e of this._compilations) if (Td(e, t)) return e;
    }
    me.getCompilingSchema = Oi;
    function Td(t, e) {
        return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
    }
    function Nd(t, e) {
        let r;
        for (; typeof (r = this.refs[e]) == 'string'; ) e = r;
        return r || this.schemas[e] || Gr.call(this, t, e);
    }
    function Gr(t, e) {
        let r = this.opts.uriResolver.parse(e),
            s = (0, Ee._getFullPath)(this.opts.uriResolver, r),
            n = (0, Ee.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
        if (Object.keys(t.schema).length > 0 && s === n) return Ys.call(this, r, t);
        let o = (0, Ee.normalizeId)(s),
            i = this.refs[o] || this.schemas[o];
        if (typeof i == 'string') {
            let a = Gr.call(this, t, i);
            return typeof a?.schema != 'object' ? void 0 : Ys.call(this, r, a);
        }
        if (typeof i?.schema == 'object') {
            if ((i.validate || Qs.call(this, i), o === (0, Ee.normalizeId)(e))) {
                let { schema: a } = i,
                    { schemaId: c } = this.opts,
                    u = a[c];
                return (
                    u && (n = (0, Ee.resolveUrl)(this.opts.uriResolver, n, u)),
                    new Et({ schema: a, schemaId: c, root: t, baseId: n })
                );
            }
            return Ys.call(this, r, i);
        }
    }
    me.resolveSchema = Gr;
    var Cd = new Set(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
    function Ys(t, { baseId: e, schema: r, root: s }) {
        var n;
        if (((n = t.fragment) === null || n === void 0 ? void 0 : n[0]) !== '/') return;
        for (let a of t.fragment.slice(1).split('/')) {
            if (typeof r == 'boolean') return;
            let c = r[(0, Ri.unescapeFragment)(a)];
            if (c === void 0) return;
            r = c;
            let u = typeof r == 'object' && r[this.opts.schemaId];
            !Cd.has(a) && u && (e = (0, Ee.resolveUrl)(this.opts.uriResolver, e, u));
        }
        let o;
        if (typeof r != 'boolean' && r.$ref && !(0, Ri.schemaHasRulesButRef)(r, this.RULES)) {
            let a = (0, Ee.resolveUrl)(this.opts.uriResolver, e, r.$ref);
            o = Gr.call(this, s, a);
        }
        let { schemaId: i } = this.opts;
        if (((o = o || new Et({ schema: r, schemaId: i, root: s, baseId: e })), o.schema !== o.root.schema)) return o;
    }
});
var Ti = R((n_, Ad) => {
    Ad.exports = {
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
var Ci = R((o_, Ni) => {
    'use strict';
    var Md = {
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
    Ni.exports = { HEX: Md };
});
var qi = R((i_, Di) => {
    'use strict';
    var { HEX: Gd } = Ci();
    function ji(t) {
        if (Ii(t, '.') < 3) return { host: t, isIPV4: !1 };
        let e =
                t.match(
                    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u,
                ) || [],
            [r] = e;
        return r ? { host: kd(r, '.'), isIPV4: !0 } : { host: t, isIPV4: !1 };
    }
    function Xs(t, e = !1) {
        let r = '',
            s = !0;
        for (let n of t) {
            if (Gd[n] === void 0) return;
            n !== '0' && s === !0 && (s = !1), s || (r += n);
        }
        return e && r.length === 0 && (r = '0'), r;
    }
    function jd(t) {
        let e = 0,
            r = { error: !1, address: '', zone: '' },
            s = [],
            n = [],
            o = !1,
            i = !1,
            a = !1;
        function c() {
            if (n.length) {
                if (o === !1) {
                    let u = Xs(n);
                    if (u !== void 0) s.push(u);
                    else return (r.error = !0), !1;
                }
                n.length = 0;
            }
            return !0;
        }
        for (let u = 0; u < t.length; u++) {
            let l = t[u];
            if (!(l === '[' || l === ']'))
                if (l === ':') {
                    if ((i === !0 && (a = !0), !c())) break;
                    if ((e++, s.push(':'), e > 7)) {
                        r.error = !0;
                        break;
                    }
                    u - 1 >= 0 && t[u - 1] === ':' && (i = !0);
                    continue;
                } else if (l === '%') {
                    if (!c()) break;
                    o = !0;
                } else {
                    n.push(l);
                    continue;
                }
        }
        return (
            n.length && (o ? (r.zone = n.join('')) : a ? s.push(n.join('')) : s.push(Xs(n))),
            (r.address = s.join('')),
            r
        );
    }
    function ki(t, e = {}) {
        if (Ii(t, ':') < 2) return { host: t, isIPV6: !1 };
        let r = jd(t);
        if (r.error) return { host: t, isIPV6: !1 };
        {
            let s = r.address,
                n = r.address;
            return r.zone && ((s += `%${r.zone}`), (n += `%25${r.zone}`)), { host: s, escapedHost: n, isIPV6: !0 };
        }
    }
    function kd(t, e) {
        let r = '',
            s = !0,
            n = t.length;
        for (let o = 0; o < n; o++) {
            let i = t[o];
            i === '0' && s
                ? ((o + 1 <= n && t[o + 1] === e) || o + 1 === n) && ((r += i), (s = !1))
                : (i === e ? (s = !0) : (s = !1), (r += i));
        }
        return r;
    }
    function Ii(t, e) {
        let r = 0;
        for (let s = 0; s < t.length; s++) t[s] === e && r++;
        return r;
    }
    var Ai = /^\.\.?\//u,
        Mi = /^\/\.(?:\/|$)/u,
        Gi = /^\/\.\.(?:\/|$)/u,
        Id = /^\/?(?:.|\n)*?(?=\/|$)/u;
    function Dd(t) {
        let e = [];
        for (; t.length; )
            if (t.match(Ai)) t = t.replace(Ai, '');
            else if (t.match(Mi)) t = t.replace(Mi, '/');
            else if (t.match(Gi)) (t = t.replace(Gi, '/')), e.pop();
            else if (t === '.' || t === '..') t = '';
            else {
                let r = t.match(Id);
                if (r) {
                    let s = r[0];
                    (t = t.slice(s.length)), e.push(s);
                } else throw new Error('Unexpected dot segment condition');
            }
        return e.join('');
    }
    function qd(t, e) {
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
    function xd(t, e) {
        let r = [];
        if ((t.userinfo !== void 0 && (r.push(t.userinfo), r.push('@')), t.host !== void 0)) {
            let s = unescape(t.host),
                n = ji(s);
            if (n.isIPV4) s = n.host;
            else {
                let o = ki(n.host, { isIPV4: !1 });
                o.isIPV6 === !0 ? (s = `[${o.escapedHost}]`) : (s = t.host);
            }
            r.push(s);
        }
        return (
            (typeof t.port == 'number' || typeof t.port == 'string') && (r.push(':'), r.push(String(t.port))),
            r.length ? r.join('') : void 0
        );
    }
    Di.exports = {
        recomposeAuthority: xd,
        normalizeComponentEncoding: qd,
        removeDotSegments: Dd,
        normalizeIPv4: ji,
        normalizeIPv6: ki,
        stringArrayToHexStripped: Xs,
    };
});
var Ki = R((a_, Li) => {
    'use strict';
    var Fd = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu,
        Vd = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    function xi(t) {
        return typeof t.secure == 'boolean' ? t.secure : String(t.scheme).toLowerCase() === 'wss';
    }
    function Fi(t) {
        return t.host || (t.error = t.error || 'HTTP URIs must have a host.'), t;
    }
    function Vi(t) {
        let e = String(t.scheme).toLowerCase() === 'https';
        return (t.port === (e ? 443 : 80) || t.port === '') && (t.port = void 0), t.path || (t.path = '/'), t;
    }
    function Ud(t) {
        return (
            (t.secure = xi(t)),
            (t.resourceName = (t.path || '/') + (t.query ? `?${t.query}` : '')),
            (t.path = void 0),
            (t.query = void 0),
            t
        );
    }
    function Ld(t) {
        if (
            ((t.port === (xi(t) ? 443 : 80) || t.port === '') && (t.port = void 0),
            typeof t.secure == 'boolean' && ((t.scheme = t.secure ? 'wss' : 'ws'), (t.secure = void 0)),
            t.resourceName)
        ) {
            let [e, r] = t.resourceName.split('?');
            (t.path = e && e !== '/' ? e : void 0), (t.query = r), (t.resourceName = void 0);
        }
        return (t.fragment = void 0), t;
    }
    function Kd(t, e) {
        if (!t.path) return (t.error = 'URN can not be parsed'), t;
        let r = t.path.match(Vd);
        if (r) {
            let s = e.scheme || t.scheme || 'urn';
            (t.nid = r[1].toLowerCase()), (t.nss = r[2]);
            let n = `${s}:${e.nid || t.nid}`,
                o = Zs[n];
            (t.path = void 0), o && (t = o.parse(t, e));
        } else t.error = t.error || 'URN can not be parsed.';
        return t;
    }
    function zd(t, e) {
        let r = e.scheme || t.scheme || 'urn',
            s = t.nid.toLowerCase(),
            n = `${r}:${e.nid || s}`,
            o = Zs[n];
        o && (t = o.serialize(t, e));
        let i = t,
            a = t.nss;
        return (i.path = `${s || e.nid}:${a}`), (e.skipEscape = !0), i;
    }
    function Hd(t, e) {
        let r = t;
        return (
            (r.uuid = r.nss),
            (r.nss = void 0),
            !e.tolerant && (!r.uuid || !Fd.test(r.uuid)) && (r.error = r.error || 'UUID is not valid.'),
            r
        );
    }
    function Bd(t) {
        let e = t;
        return (e.nss = (t.uuid || '').toLowerCase()), e;
    }
    var Ui = { scheme: 'http', domainHost: !0, parse: Fi, serialize: Vi },
        Wd = { scheme: 'https', domainHost: Ui.domainHost, parse: Fi, serialize: Vi },
        kr = { scheme: 'ws', domainHost: !0, parse: Ud, serialize: Ld },
        Jd = { scheme: 'wss', domainHost: kr.domainHost, parse: kr.parse, serialize: kr.serialize },
        Yd = { scheme: 'urn', parse: Kd, serialize: zd, skipNormalize: !0 },
        Qd = { scheme: 'urn:uuid', parse: Hd, serialize: Bd, skipNormalize: !0 },
        Zs = { http: Ui, https: Wd, ws: kr, wss: Jd, urn: Yd, 'urn:uuid': Qd };
    Li.exports = Zs;
});
var Hi = R((c_, Dr) => {
    'use strict';
    var {
            normalizeIPv6: Xd,
            normalizeIPv4: Zd,
            removeDotSegments: Xt,
            recomposeAuthority: ef,
            normalizeComponentEncoding: Ir,
        } = qi(),
        en = Ki();
    function tf(t, e) {
        return typeof t == 'string' ? (t = Ne(De(t, e), e)) : typeof t == 'object' && (t = De(Ne(t, e), e)), t;
    }
    function rf(t, e, r) {
        let s = Object.assign({ scheme: 'null' }, r),
            n = zi(De(t, s), De(e, s), s, !0);
        return Ne(n, { ...s, skipEscape: !0 });
    }
    function zi(t, e, r, s) {
        let n = {};
        return (
            s || ((t = De(Ne(t, r), r)), (e = De(Ne(e, r), r))),
            (r = r || {}),
            !r.tolerant && e.scheme
                ? ((n.scheme = e.scheme),
                  (n.userinfo = e.userinfo),
                  (n.host = e.host),
                  (n.port = e.port),
                  (n.path = Xt(e.path || '')),
                  (n.query = e.query))
                : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0
                      ? ((n.userinfo = e.userinfo),
                        (n.host = e.host),
                        (n.port = e.port),
                        (n.path = Xt(e.path || '')),
                        (n.query = e.query))
                      : (e.path
                            ? (e.path.charAt(0) === '/'
                                  ? (n.path = Xt(e.path))
                                  : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path
                                        ? (n.path = `/${e.path}`)
                                        : t.path
                                          ? (n.path = t.path.slice(0, t.path.lastIndexOf('/') + 1) + e.path)
                                          : (n.path = e.path),
                                    (n.path = Xt(n.path))),
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
    function sf(t, e, r) {
        return (
            typeof t == 'string'
                ? ((t = unescape(t)), (t = Ne(Ir(De(t, r), !0), { ...r, skipEscape: !0 })))
                : typeof t == 'object' && (t = Ne(Ir(t, !0), { ...r, skipEscape: !0 })),
            typeof e == 'string'
                ? ((e = unescape(e)), (e = Ne(Ir(De(e, r), !0), { ...r, skipEscape: !0 })))
                : typeof e == 'object' && (e = Ne(Ir(e, !0), { ...r, skipEscape: !0 })),
            t.toLowerCase() === e.toLowerCase()
        );
    }
    function Ne(t, e) {
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
            o = en[(s.scheme || r.scheme || '').toLowerCase()];
        o && o.serialize && o.serialize(r, s),
            r.path !== void 0 &&
                (s.skipEscape
                    ? (r.path = unescape(r.path))
                    : ((r.path = escape(r.path)), r.scheme !== void 0 && (r.path = r.path.split('%3A').join(':')))),
            s.reference !== 'suffix' && r.scheme && (n.push(r.scheme), n.push(':'));
        let i = ef(r, s);
        if (
            (i !== void 0 &&
                (s.reference !== 'suffix' && n.push('//'),
                n.push(i),
                r.path && r.path.charAt(0) !== '/' && n.push('/')),
            r.path !== void 0)
        ) {
            let a = r.path;
            !s.absolutePath && (!o || !o.absolutePath) && (a = Xt(a)),
                i === void 0 && (a = a.replace(/^\/\//u, '/%2F')),
                n.push(a);
        }
        return (
            r.query !== void 0 && (n.push('?'), n.push(r.query)),
            r.fragment !== void 0 && (n.push('#'), n.push(r.fragment)),
            n.join('')
        );
    }
    var nf = Array.from({ length: 127 }, (t, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
    function of(t) {
        let e = 0;
        for (let r = 0, s = t.length; r < s; ++r) if (((e = t.charCodeAt(r)), e > 126 || nf[e])) return !0;
        return !1;
    }
    var af =
        /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function De(t, e) {
        let r = Object.assign({}, e),
            s = { scheme: void 0, userinfo: void 0, host: '', port: void 0, path: '', query: void 0, fragment: void 0 },
            n = t.indexOf('%') !== -1,
            o = !1;
        r.reference === 'suffix' && (t = `${r.scheme ? `${r.scheme}:` : ''}//${t}`);
        let i = t.match(af);
        if (i) {
            if (
                ((s.scheme = i[1]),
                (s.userinfo = i[3]),
                (s.host = i[4]),
                (s.port = parseInt(i[5], 10)),
                (s.path = i[6] || ''),
                (s.query = i[7]),
                (s.fragment = i[8]),
                isNaN(s.port) && (s.port = i[5]),
                s.host)
            ) {
                let c = Zd(s.host);
                if (c.isIPV4 === !1) {
                    let u = Xd(c.host, { isIPV4: !1 });
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
            let a = en[(r.scheme || s.scheme || '').toLowerCase()];
            if (
                !r.unicodeSupport &&
                (!a || !a.unicodeSupport) &&
                s.host &&
                (r.domainHost || (a && a.domainHost)) &&
                o === !1 &&
                of(s.host)
            )
                try {
                    s.host = URL.domainToASCII(s.host.toLowerCase());
                } catch (c) {
                    s.error = s.error || `Host's domain name can not be converted to ASCII: ${c}`;
                }
            (!a || (a && !a.skipNormalize)) &&
                (n && s.scheme !== void 0 && (s.scheme = unescape(s.scheme)),
                n && s.userinfo !== void 0 && (s.userinfo = unescape(s.userinfo)),
                n && s.host !== void 0 && (s.host = unescape(s.host)),
                s.path !== void 0 && s.path.length && (s.path = escape(unescape(s.path))),
                s.fragment !== void 0 && s.fragment.length && (s.fragment = encodeURI(decodeURIComponent(s.fragment)))),
                a && a.parse && a.parse(s, r);
        } else s.error = s.error || 'URI can not be parsed.';
        return s;
    }
    var tn = { SCHEMES: en, normalize: tf, resolve: rf, resolveComponents: zi, equal: sf, serialize: Ne, parse: De };
    Dr.exports = tn;
    Dr.exports.default = tn;
    Dr.exports.fastUri = tn;
});
var Wi = R((rn) => {
    'use strict';
    Object.defineProperty(rn, '__esModule', { value: !0 });
    var Bi = Hi();
    Bi.code = 'require("ajv/dist/runtime/uri").default';
    rn.default = Bi;
});
var ra = R((Q) => {
    'use strict';
    Object.defineProperty(Q, '__esModule', { value: !0 });
    Q.CodeGen = Q.Name = Q.nil = Q.stringify = Q.str = Q._ = Q.KeywordCxt = void 0;
    var cf = Yt();
    Object.defineProperty(Q, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return cf.KeywordCxt;
        },
    });
    var wt = j();
    Object.defineProperty(Q, '_', {
        enumerable: !0,
        get: function () {
            return wt._;
        },
    });
    Object.defineProperty(Q, 'str', {
        enumerable: !0,
        get: function () {
            return wt.str;
        },
    });
    Object.defineProperty(Q, 'stringify', {
        enumerable: !0,
        get: function () {
            return wt.stringify;
        },
    });
    Object.defineProperty(Q, 'nil', {
        enumerable: !0,
        get: function () {
            return wt.nil;
        },
    });
    Object.defineProperty(Q, 'Name', {
        enumerable: !0,
        get: function () {
            return wt.Name;
        },
    });
    Object.defineProperty(Q, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return wt.CodeGen;
        },
    });
    var uf = Mr(),
        Zi = Qt(),
        lf = Ms(),
        Zt = jr(),
        df = j(),
        er = Bt(),
        qr = Ht(),
        nn = F(),
        Ji = Ti(),
        ff = Wi(),
        ea = (t, e) => new RegExp(t, e);
    ea.code = 'new RegExp';
    var pf = ['removeAdditional', 'useDefaults', 'coerceTypes'],
        hf = new Set([
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
        mf = {
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
        gf = {
            ignoreKeywordsWithRef: '',
            jsPropertySyntax: '',
            unicode: '"minLength"/"maxLength" account for unicode characters by default.',
        },
        Yi = 200;
    function yf(t) {
        var e, r, s, n, o, i, a, c, u, l, f, g, w, h, m, $, _, S, P, E, y, N, V, ve, de;
        let J = t.strict,
            B = (e = t.code) === null || e === void 0 ? void 0 : e.optimize,
            $e = B === !0 || B === void 0 ? 1 : B || 0,
            Rt = (s = (r = t.code) === null || r === void 0 ? void 0 : r.regExp) !== null && s !== void 0 ? s : ea,
            es = (n = t.uriResolver) !== null && n !== void 0 ? n : ff.default;
        return {
            strictSchema: (i = (o = t.strictSchema) !== null && o !== void 0 ? o : J) !== null && i !== void 0 ? i : !0,
            strictNumbers:
                (c = (a = t.strictNumbers) !== null && a !== void 0 ? a : J) !== null && c !== void 0 ? c : !0,
            strictTypes:
                (l = (u = t.strictTypes) !== null && u !== void 0 ? u : J) !== null && l !== void 0 ? l : 'log',
            strictTuples:
                (g = (f = t.strictTuples) !== null && f !== void 0 ? f : J) !== null && g !== void 0 ? g : 'log',
            strictRequired:
                (h = (w = t.strictRequired) !== null && w !== void 0 ? w : J) !== null && h !== void 0 ? h : !1,
            code: t.code ? { ...t.code, optimize: $e, regExp: Rt } : { optimize: $e, regExp: Rt },
            loopRequired: (m = t.loopRequired) !== null && m !== void 0 ? m : Yi,
            loopEnum: ($ = t.loopEnum) !== null && $ !== void 0 ? $ : Yi,
            meta: (_ = t.meta) !== null && _ !== void 0 ? _ : !0,
            messages: (S = t.messages) !== null && S !== void 0 ? S : !0,
            inlineRefs: (P = t.inlineRefs) !== null && P !== void 0 ? P : !0,
            schemaId: (E = t.schemaId) !== null && E !== void 0 ? E : '$id',
            addUsedSchema: (y = t.addUsedSchema) !== null && y !== void 0 ? y : !0,
            validateSchema: (N = t.validateSchema) !== null && N !== void 0 ? N : !0,
            validateFormats: (V = t.validateFormats) !== null && V !== void 0 ? V : !0,
            unicodeRegExp: (ve = t.unicodeRegExp) !== null && ve !== void 0 ? ve : !0,
            int32range: (de = t.int32range) !== null && de !== void 0 ? de : !0,
            uriResolver: es,
        };
    }
    var tr = class {
        constructor(e = {}) {
            (this.schemas = {}),
                (this.refs = {}),
                (this.formats = {}),
                (this._compilations = new Set()),
                (this._loading = {}),
                (this._cache = new Map()),
                (e = this.opts = { ...e, ...yf(e) });
            let { es5: r, lines: s } = this.opts.code;
            (this.scope = new df.ValueScope({ scope: {}, prefixes: hf, es5: r, lines: s })),
                (this.logger = bf(e.logger));
            let n = e.validateFormats;
            (e.validateFormats = !1),
                (this.RULES = (0, lf.getRules)()),
                Qi.call(this, mf, e, 'NOT SUPPORTED'),
                Qi.call(this, gf, e, 'DEPRECATED', 'warn'),
                (this._metaOpts = vf.call(this)),
                e.formats && Ef.call(this),
                this._addVocabularies(),
                this._addDefaultMetaSchema(),
                e.keywords && wf.call(this, e.keywords),
                typeof e.meta == 'object' && this.addMetaSchema(e.meta),
                _f.call(this),
                (e.validateFormats = n);
        }
        _addVocabularies() {
            this.addKeyword('$async');
        }
        _addDefaultMetaSchema() {
            let { $data: e, meta: r, schemaId: s } = this.opts,
                n = Ji;
            s === 'id' && ((n = { ...Ji }), (n.id = n.$id), delete n.$id), r && e && this.addMetaSchema(n, n[s], !1);
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
            async function n(l, f) {
                await o.call(this, l.$schema);
                let g = this._addSchema(l, f);
                return g.validate || i.call(this, g);
            }
            async function o(l) {
                l && !this.getSchema(l) && (await n.call(this, { $ref: l }, !0));
            }
            async function i(l) {
                try {
                    return this._compileSchemaEnv(l);
                } catch (f) {
                    if (!(f instanceof Zi.default)) throw f;
                    return a.call(this, f), await c.call(this, f.missingSchema), i.call(this, l);
                }
            }
            function a({ missingSchema: l, missingRef: f }) {
                if (this.refs[l]) throw new Error(`AnySchema ${l} is loaded but ${f} cannot be resolved`);
            }
            async function c(l) {
                let f = await u.call(this, l);
                this.refs[l] || (await o.call(this, f.$schema)), this.refs[l] || this.addSchema(f, l, r);
            }
            async function u(l) {
                let f = this._loading[l];
                if (f) return f;
                try {
                    return await (this._loading[l] = s(l));
                } finally {
                    delete this._loading[l];
                }
            }
        }
        addSchema(e, r, s, n = this.opts.validateSchema) {
            if (Array.isArray(e)) {
                for (let i of e) this.addSchema(i, void 0, s, n);
                return this;
            }
            let o;
            if (typeof e == 'object') {
                let { schemaId: i } = this.opts;
                if (((o = e[i]), o !== void 0 && typeof o != 'string')) throw new Error(`schema ${i} must be string`);
            }
            return (
                (r = (0, er.normalizeId)(r || o)),
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
            for (; typeof (r = Xi.call(this, e)) == 'string'; ) e = r;
            if (r === void 0) {
                let { schemaId: s } = this.opts,
                    n = new Zt.SchemaEnv({ schema: {}, schemaId: s });
                if (((r = Zt.resolveSchema.call(this, n, e)), !r)) return;
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
                    let r = Xi.call(this, e);
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
                    return s && ((s = (0, er.normalizeId)(s)), delete this.schemas[s], delete this.refs[s]), this;
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
            if ((Pf.call(this, s, r), !r)) return (0, nn.eachItem)(s, (o) => sn.call(this, o)), this;
            Of.call(this, r);
            let n = { ...r, type: (0, qr.getJSONTypes)(r.type), schemaType: (0, qr.getJSONTypes)(r.schemaType) };
            return (
                (0, nn.eachItem)(
                    s,
                    n.type.length === 0
                        ? (o) => sn.call(this, o, n)
                        : (o) => n.type.forEach((i) => sn.call(this, o, n, i)),
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
                    i = e;
                for (let a of o) i = i[a];
                for (let a in s) {
                    let c = s[a];
                    if (typeof c != 'object') continue;
                    let { $data: u } = c.definition,
                        l = i[a];
                    u && l && (i[a] = ta(l));
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
            let i,
                { schemaId: a } = this.opts;
            if (typeof e == 'object') i = e[a];
            else {
                if (this.opts.jtd) throw new Error('schema must be object');
                if (typeof e != 'boolean') throw new Error('schema must be object or boolean');
            }
            let c = this._cache.get(e);
            if (c !== void 0) return c;
            s = (0, er.normalizeId)(i || s);
            let u = er.getSchemaRefs.call(this, e, s);
            return (
                (c = new Zt.SchemaEnv({ schema: e, schemaId: a, meta: r, baseId: s, localRefs: u })),
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
            if ((e.meta ? this._compileMetaSchema(e) : Zt.compileSchema.call(this, e), !e.validate))
                throw new Error('ajv implementation error');
            return e.validate;
        }
        _compileMetaSchema(e) {
            let r = this.opts;
            this.opts = this._metaOpts;
            try {
                Zt.compileSchema.call(this, e);
            } finally {
                this.opts = r;
            }
        }
    };
    tr.ValidationError = uf.default;
    tr.MissingRefError = Zi.default;
    Q.default = tr;
    function Qi(t, e, r, s = 'error') {
        for (let n in t) {
            let o = n;
            o in e && this.logger[s](`${r}: option ${n}. ${t[o]}`);
        }
    }
    function Xi(t) {
        return (t = (0, er.normalizeId)(t)), this.schemas[t] || this.refs[t];
    }
    function _f() {
        let t = this.opts.schemas;
        if (t)
            if (Array.isArray(t)) this.addSchema(t);
            else for (let e in t) this.addSchema(t[e], e);
    }
    function Ef() {
        for (let t in this.opts.formats) {
            let e = this.opts.formats[t];
            e && this.addFormat(t, e);
        }
    }
    function wf(t) {
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
    function vf() {
        let t = { ...this.opts };
        for (let e of pf) delete t[e];
        return t;
    }
    var $f = { log() {}, warn() {}, error() {} };
    function bf(t) {
        if (t === !1) return $f;
        if (t === void 0) return console;
        if (t.log && t.warn && t.error) return t;
        throw new Error('logger must implement log, warn and error methods');
    }
    var Sf = /^[a-z_$][a-z0-9_$:-]*$/i;
    function Pf(t, e) {
        let { RULES: r } = this;
        if (
            ((0, nn.eachItem)(t, (s) => {
                if (r.keywords[s]) throw new Error(`Keyword ${s} is already defined`);
                if (!Sf.test(s)) throw new Error(`Keyword ${s} has invalid name`);
            }),
            !!e && e.$data && !('code' in e || 'validate' in e))
        )
            throw new Error('$data keyword must have "code" or "validate" function');
    }
    function sn(t, e, r) {
        var s;
        let n = e?.post;
        if (r && n) throw new Error('keyword with "post" flag cannot have "type"');
        let { RULES: o } = this,
            i = n ? o.post : o.rules.find(({ type: c }) => c === r);
        if ((i || ((i = { type: r, rules: [] }), o.rules.push(i)), (o.keywords[t] = !0), !e)) return;
        let a = {
            keyword: t,
            definition: { ...e, type: (0, qr.getJSONTypes)(e.type), schemaType: (0, qr.getJSONTypes)(e.schemaType) },
        };
        e.before ? Rf.call(this, i, a, e.before) : i.rules.push(a),
            (o.all[t] = a),
            (s = e.implements) === null || s === void 0 || s.forEach((c) => this.addKeyword(c));
    }
    function Rf(t, e, r) {
        let s = t.rules.findIndex((n) => n.keyword === r);
        s >= 0 ? t.rules.splice(s, 0, e) : (t.rules.push(e), this.logger.warn(`rule ${r} is not defined`));
    }
    function Of(t) {
        let { metaSchema: e } = t;
        e !== void 0 && (t.$data && this.opts.$data && (e = ta(e)), (t.validateSchema = this.compile(e, !0)));
    }
    var Tf = { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' };
    function ta(t) {
        return { anyOf: [t, Tf] };
    }
});
var sa = R((on) => {
    'use strict';
    Object.defineProperty(on, '__esModule', { value: !0 });
    var Nf = {
        keyword: 'id',
        code() {
            throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
        },
    };
    on.default = Nf;
});
var aa = R((ot) => {
    'use strict';
    Object.defineProperty(ot, '__esModule', { value: !0 });
    ot.callRef = ot.getValidate = void 0;
    var Cf = Qt(),
        na = he(),
        ue = j(),
        vt = ke(),
        oa = jr(),
        xr = F(),
        Af = {
            keyword: '$ref',
            schemaType: 'string',
            code(t) {
                let { gen: e, schema: r, it: s } = t,
                    { baseId: n, schemaEnv: o, validateName: i, opts: a, self: c } = s,
                    { root: u } = o;
                if ((r === '#' || r === '#/') && n === u.baseId) return f();
                let l = oa.resolveRef.call(c, u, n, r);
                if (l === void 0) throw new Cf.default(s.opts.uriResolver, n, r);
                if (l instanceof oa.SchemaEnv) return g(l);
                return w(l);
                function f() {
                    if (o === u) return Fr(t, i, o, o.$async);
                    let h = e.scopeValue('root', { ref: u });
                    return Fr(t, (0, ue._)`${h}.validate`, u, u.$async);
                }
                function g(h) {
                    let m = ia(t, h);
                    Fr(t, m, h, h.$async);
                }
                function w(h) {
                    let m = e.scopeValue(
                            'schema',
                            a.code.source === !0 ? { ref: h, code: (0, ue.stringify)(h) } : { ref: h },
                        ),
                        $ = e.name('valid'),
                        _ = t.subschema(
                            { schema: h, dataTypes: [], schemaPath: ue.nil, topSchemaRef: m, errSchemaPath: r },
                            $,
                        );
                    t.mergeEvaluated(_), t.ok($);
                }
            },
        };
    function ia(t, e) {
        let { gen: r } = t;
        return e.validate
            ? r.scopeValue('validate', { ref: e.validate })
            : (0, ue._)`${r.scopeValue('wrapper', { ref: e })}.validate`;
    }
    ot.getValidate = ia;
    function Fr(t, e, r, s) {
        let { gen: n, it: o } = t,
            { allErrors: i, schemaEnv: a, opts: c } = o,
            u = c.passContext ? vt.default.this : ue.nil;
        s ? l() : f();
        function l() {
            if (!a.$async) throw new Error('async schema referenced by sync schema');
            let h = n.let('valid');
            n.try(
                () => {
                    n.code((0, ue._)`await ${(0, na.callValidateCode)(t, e, u)}`), w(e), i || n.assign(h, !0);
                },
                (m) => {
                    n.if((0, ue._)`!(${m} instanceof ${o.ValidationError})`, () => n.throw(m)),
                        g(m),
                        i || n.assign(h, !1);
                },
            ),
                t.ok(h);
        }
        function f() {
            t.result(
                (0, na.callValidateCode)(t, e, u),
                () => w(e),
                () => g(e),
            );
        }
        function g(h) {
            let m = (0, ue._)`${h}.errors`;
            n.assign(
                vt.default.vErrors,
                (0, ue._)`${vt.default.vErrors} === null ? ${m} : ${vt.default.vErrors}.concat(${m})`,
            ),
                n.assign(vt.default.errors, (0, ue._)`${vt.default.vErrors}.length`);
        }
        function w(h) {
            var m;
            if (!o.opts.unevaluated) return;
            let $ = (m = r?.validate) === null || m === void 0 ? void 0 : m.evaluated;
            if (o.props !== !0)
                if ($ && !$.dynamicProps)
                    $.props !== void 0 && (o.props = xr.mergeEvaluated.props(n, $.props, o.props));
                else {
                    let _ = n.var('props', (0, ue._)`${h}.evaluated.props`);
                    o.props = xr.mergeEvaluated.props(n, _, o.props, ue.Name);
                }
            if (o.items !== !0)
                if ($ && !$.dynamicItems)
                    $.items !== void 0 && (o.items = xr.mergeEvaluated.items(n, $.items, o.items));
                else {
                    let _ = n.var('items', (0, ue._)`${h}.evaluated.items`);
                    o.items = xr.mergeEvaluated.items(n, _, o.items, ue.Name);
                }
        }
    }
    ot.callRef = Fr;
    ot.default = Af;
});
var ca = R((an) => {
    'use strict';
    Object.defineProperty(an, '__esModule', { value: !0 });
    var Mf = sa(),
        Gf = aa(),
        jf = ['$schema', '$id', '$defs', '$vocabulary', { keyword: '$comment' }, 'definitions', Mf.default, Gf.default];
    an.default = jf;
});
var ua = R((cn) => {
    'use strict';
    Object.defineProperty(cn, '__esModule', { value: !0 });
    var Vr = j(),
        We = Vr.operators,
        Ur = {
            maximum: { okStr: '<=', ok: We.LTE, fail: We.GT },
            minimum: { okStr: '>=', ok: We.GTE, fail: We.LT },
            exclusiveMaximum: { okStr: '<', ok: We.LT, fail: We.GTE },
            exclusiveMinimum: { okStr: '>', ok: We.GT, fail: We.LTE },
        },
        kf = {
            message: ({ keyword: t, schemaCode: e }) => (0, Vr.str)`must be ${Ur[t].okStr} ${e}`,
            params: ({ keyword: t, schemaCode: e }) => (0, Vr._)`{comparison: ${Ur[t].okStr}, limit: ${e}}`,
        },
        If = {
            keyword: Object.keys(Ur),
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: kf,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t;
                t.fail$data((0, Vr._)`${r} ${Ur[e].fail} ${s} || isNaN(${r})`);
            },
        };
    cn.default = If;
});
var la = R((un) => {
    'use strict';
    Object.defineProperty(un, '__esModule', { value: !0 });
    var rr = j(),
        Df = {
            message: ({ schemaCode: t }) => (0, rr.str)`must be multiple of ${t}`,
            params: ({ schemaCode: t }) => (0, rr._)`{multipleOf: ${t}}`,
        },
        qf = {
            keyword: 'multipleOf',
            type: 'number',
            schemaType: 'number',
            $data: !0,
            error: Df,
            code(t) {
                let { gen: e, data: r, schemaCode: s, it: n } = t,
                    o = n.opts.multipleOfPrecision,
                    i = e.let('res'),
                    a = o ? (0, rr._)`Math.abs(Math.round(${i}) - ${i}) > 1e-${o}` : (0, rr._)`${i} !== parseInt(${i})`;
                t.fail$data((0, rr._)`(${s} === 0 || (${i} = ${r}/${s}, ${a}))`);
            },
        };
    un.default = qf;
});
var fa = R((ln) => {
    'use strict';
    Object.defineProperty(ln, '__esModule', { value: !0 });
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
    ln.default = da;
    da.code = 'require("ajv/dist/runtime/ucs2length").default';
});
var pa = R((dn) => {
    'use strict';
    Object.defineProperty(dn, '__esModule', { value: !0 });
    var it = j(),
        xf = F(),
        Ff = fa(),
        Vf = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxLength' ? 'more' : 'fewer';
                return (0, it.str)`must NOT have ${r} than ${e} characters`;
            },
            params: ({ schemaCode: t }) => (0, it._)`{limit: ${t}}`,
        },
        Uf = {
            keyword: ['maxLength', 'minLength'],
            type: 'string',
            schemaType: 'number',
            $data: !0,
            error: Vf,
            code(t) {
                let { keyword: e, data: r, schemaCode: s, it: n } = t,
                    o = e === 'maxLength' ? it.operators.GT : it.operators.LT,
                    i =
                        n.opts.unicode === !1
                            ? (0, it._)`${r}.length`
                            : (0, it._)`${(0, xf.useFunc)(t.gen, Ff.default)}(${r})`;
                t.fail$data((0, it._)`${i} ${o} ${s}`);
            },
        };
    dn.default = Uf;
});
var ha = R((fn) => {
    'use strict';
    Object.defineProperty(fn, '__esModule', { value: !0 });
    var Lf = he(),
        Lr = j(),
        Kf = {
            message: ({ schemaCode: t }) => (0, Lr.str)`must match pattern "${t}"`,
            params: ({ schemaCode: t }) => (0, Lr._)`{pattern: ${t}}`,
        },
        zf = {
            keyword: 'pattern',
            type: 'string',
            schemaType: 'string',
            $data: !0,
            error: Kf,
            code(t) {
                let { data: e, $data: r, schema: s, schemaCode: n, it: o } = t,
                    i = o.opts.unicodeRegExp ? 'u' : '',
                    a = r ? (0, Lr._)`(new RegExp(${n}, ${i}))` : (0, Lf.usePattern)(t, s);
                t.fail$data((0, Lr._)`!${a}.test(${e})`);
            },
        };
    fn.default = zf;
});
var ma = R((pn) => {
    'use strict';
    Object.defineProperty(pn, '__esModule', { value: !0 });
    var sr = j(),
        Hf = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxProperties' ? 'more' : 'fewer';
                return (0, sr.str)`must NOT have ${r} than ${e} properties`;
            },
            params: ({ schemaCode: t }) => (0, sr._)`{limit: ${t}}`,
        },
        Bf = {
            keyword: ['maxProperties', 'minProperties'],
            type: 'object',
            schemaType: 'number',
            $data: !0,
            error: Hf,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxProperties' ? sr.operators.GT : sr.operators.LT;
                t.fail$data((0, sr._)`Object.keys(${r}).length ${n} ${s}`);
            },
        };
    pn.default = Bf;
});
var ga = R((hn) => {
    'use strict';
    Object.defineProperty(hn, '__esModule', { value: !0 });
    var nr = he(),
        or = j(),
        Wf = F(),
        Jf = {
            message: ({ params: { missingProperty: t } }) => (0, or.str)`must have required property '${t}'`,
            params: ({ params: { missingProperty: t } }) => (0, or._)`{missingProperty: ${t}}`,
        },
        Yf = {
            keyword: 'required',
            type: 'object',
            schemaType: 'array',
            $data: !0,
            error: Jf,
            code(t) {
                let { gen: e, schema: r, schemaCode: s, data: n, $data: o, it: i } = t,
                    { opts: a } = i;
                if (!o && r.length === 0) return;
                let c = r.length >= a.loopRequired;
                if ((i.allErrors ? u() : l(), a.strictRequired)) {
                    let w = t.parentSchema.properties,
                        { definedProperties: h } = t.it;
                    for (let m of r)
                        if (w?.[m] === void 0 && !h.has(m)) {
                            let $ = i.schemaEnv.baseId + i.errSchemaPath,
                                _ = `required property "${m}" is not defined at "${$}" (strictRequired)`;
                            (0, Wf.checkStrictMode)(i, _, i.opts.strictRequired);
                        }
                }
                function u() {
                    if (c || o) t.block$data(or.nil, f);
                    else for (let w of r) (0, nr.checkReportMissingProp)(t, w);
                }
                function l() {
                    let w = e.let('missing');
                    if (c || o) {
                        let h = e.let('valid', !0);
                        t.block$data(h, () => g(w, h)), t.ok(h);
                    } else e.if((0, nr.checkMissingProp)(t, r, w)), (0, nr.reportMissingProp)(t, w), e.else();
                }
                function f() {
                    e.forOf('prop', s, (w) => {
                        t.setParams({ missingProperty: w }),
                            e.if((0, nr.noPropertyInData)(e, n, w, a.ownProperties), () => t.error());
                    });
                }
                function g(w, h) {
                    t.setParams({ missingProperty: w }),
                        e.forOf(
                            w,
                            s,
                            () => {
                                e.assign(h, (0, nr.propertyInData)(e, n, w, a.ownProperties)),
                                    e.if((0, or.not)(h), () => {
                                        t.error(), e.break();
                                    });
                            },
                            or.nil,
                        );
                }
            },
        };
    hn.default = Yf;
});
var ya = R((mn) => {
    'use strict';
    Object.defineProperty(mn, '__esModule', { value: !0 });
    var ir = j(),
        Qf = {
            message({ keyword: t, schemaCode: e }) {
                let r = t === 'maxItems' ? 'more' : 'fewer';
                return (0, ir.str)`must NOT have ${r} than ${e} items`;
            },
            params: ({ schemaCode: t }) => (0, ir._)`{limit: ${t}}`,
        },
        Xf = {
            keyword: ['maxItems', 'minItems'],
            type: 'array',
            schemaType: 'number',
            $data: !0,
            error: Qf,
            code(t) {
                let { keyword: e, data: r, schemaCode: s } = t,
                    n = e === 'maxItems' ? ir.operators.GT : ir.operators.LT;
                t.fail$data((0, ir._)`${r}.length ${n} ${s}`);
            },
        };
    mn.default = Xf;
});
var Kr = R((gn) => {
    'use strict';
    Object.defineProperty(gn, '__esModule', { value: !0 });
    var _a = Fs();
    _a.code = 'require("ajv/dist/runtime/equal").default';
    gn.default = _a;
});
var Ea = R((_n) => {
    'use strict';
    Object.defineProperty(_n, '__esModule', { value: !0 });
    var yn = Ht(),
        X = j(),
        Zf = F(),
        ep = Kr(),
        tp = {
            message: ({ params: { i: t, j: e } }) =>
                (0, X.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
            params: ({ params: { i: t, j: e } }) => (0, X._)`{i: ${t}, j: ${e}}`,
        },
        rp = {
            keyword: 'uniqueItems',
            type: 'array',
            schemaType: 'boolean',
            $data: !0,
            error: tp,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, parentSchema: o, schemaCode: i, it: a } = t;
                if (!s && !n) return;
                let c = e.let('valid'),
                    u = o.items ? (0, yn.getSchemaTypes)(o.items) : [];
                t.block$data(c, l, (0, X._)`${i} === false`), t.ok(c);
                function l() {
                    let h = e.let('i', (0, X._)`${r}.length`),
                        m = e.let('j');
                    t.setParams({ i: h, j: m }), e.assign(c, !0), e.if((0, X._)`${h} > 1`, () => (f() ? g : w)(h, m));
                }
                function f() {
                    return u.length > 0 && !u.some((h) => h === 'object' || h === 'array');
                }
                function g(h, m) {
                    let $ = e.name('item'),
                        _ = (0, yn.checkDataTypes)(u, $, a.opts.strictNumbers, yn.DataType.Wrong),
                        S = e.const('indices', (0, X._)`{}`);
                    e.for((0, X._)`;${h}--;`, () => {
                        e.let($, (0, X._)`${r}[${h}]`),
                            e.if(_, (0, X._)`continue`),
                            u.length > 1 && e.if((0, X._)`typeof ${$} == "string"`, (0, X._)`${$} += "_"`),
                            e
                                .if((0, X._)`typeof ${S}[${$}] == "number"`, () => {
                                    e.assign(m, (0, X._)`${S}[${$}]`), t.error(), e.assign(c, !1).break();
                                })
                                .code((0, X._)`${S}[${$}] = ${h}`);
                    });
                }
                function w(h, m) {
                    let $ = (0, Zf.useFunc)(e, ep.default),
                        _ = e.name('outer');
                    e.label(_).for((0, X._)`;${h}--;`, () =>
                        e.for((0, X._)`${m} = ${h}; ${m}--;`, () =>
                            e.if((0, X._)`${$}(${r}[${h}], ${r}[${m}])`, () => {
                                t.error(), e.assign(c, !1).break(_);
                            }),
                        ),
                    );
                }
            },
        };
    _n.default = rp;
});
var wa = R((wn) => {
    'use strict';
    Object.defineProperty(wn, '__esModule', { value: !0 });
    var En = j(),
        sp = F(),
        np = Kr(),
        op = { message: 'must be equal to constant', params: ({ schemaCode: t }) => (0, En._)`{allowedValue: ${t}}` },
        ip = {
            keyword: 'const',
            $data: !0,
            error: op,
            code(t) {
                let { gen: e, data: r, $data: s, schemaCode: n, schema: o } = t;
                s || (o && typeof o == 'object')
                    ? t.fail$data((0, En._)`!${(0, sp.useFunc)(e, np.default)}(${r}, ${n})`)
                    : t.fail((0, En._)`${o} !== ${r}`);
            },
        };
    wn.default = ip;
});
var va = R((vn) => {
    'use strict';
    Object.defineProperty(vn, '__esModule', { value: !0 });
    var ar = j(),
        ap = F(),
        cp = Kr(),
        up = {
            message: 'must be equal to one of the allowed values',
            params: ({ schemaCode: t }) => (0, ar._)`{allowedValues: ${t}}`,
        },
        lp = {
            keyword: 'enum',
            schemaType: 'array',
            $data: !0,
            error: up,
            code(t) {
                let { gen: e, data: r, $data: s, schema: n, schemaCode: o, it: i } = t;
                if (!s && n.length === 0) throw new Error('enum must have non-empty array');
                let a = n.length >= i.opts.loopEnum,
                    c,
                    u = () => c ?? (c = (0, ap.useFunc)(e, cp.default)),
                    l;
                if (a || s) (l = e.let('valid')), t.block$data(l, f);
                else {
                    if (!Array.isArray(n)) throw new Error('ajv implementation error');
                    let w = e.const('vSchema', o);
                    l = (0, ar.or)(...n.map((h, m) => g(w, m)));
                }
                t.pass(l);
                function f() {
                    e.assign(l, !1),
                        e.forOf('v', o, (w) => e.if((0, ar._)`${u()}(${r}, ${w})`, () => e.assign(l, !0).break()));
                }
                function g(w, h) {
                    let m = n[h];
                    return typeof m == 'object' && m !== null
                        ? (0, ar._)`${u()}(${r}, ${w}[${h}])`
                        : (0, ar._)`${r} === ${m}`;
                }
            },
        };
    vn.default = lp;
});
var $a = R(($n) => {
    'use strict';
    Object.defineProperty($n, '__esModule', { value: !0 });
    var dp = ua(),
        fp = la(),
        pp = pa(),
        hp = ha(),
        mp = ma(),
        gp = ga(),
        yp = ya(),
        _p = Ea(),
        Ep = wa(),
        wp = va(),
        vp = [
            dp.default,
            fp.default,
            pp.default,
            hp.default,
            mp.default,
            gp.default,
            yp.default,
            _p.default,
            { keyword: 'type', schemaType: ['string', 'array'] },
            { keyword: 'nullable', schemaType: 'boolean' },
            Ep.default,
            wp.default,
        ];
    $n.default = vp;
});
var Sn = R((cr) => {
    'use strict';
    Object.defineProperty(cr, '__esModule', { value: !0 });
    cr.validateAdditionalItems = void 0;
    var at = j(),
        bn = F(),
        $p = {
            message: ({ params: { len: t } }) => (0, at.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, at._)`{limit: ${t}}`,
        },
        bp = {
            keyword: 'additionalItems',
            type: 'array',
            schemaType: ['boolean', 'object'],
            before: 'uniqueItems',
            error: $p,
            code(t) {
                let { parentSchema: e, it: r } = t,
                    { items: s } = e;
                if (!Array.isArray(s)) {
                    (0, bn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return;
                }
                ba(t, s);
            },
        };
    function ba(t, e) {
        let { gen: r, schema: s, data: n, keyword: o, it: i } = t;
        i.items = !0;
        let a = r.const('len', (0, at._)`${n}.length`);
        if (s === !1) t.setParams({ len: e.length }), t.pass((0, at._)`${a} <= ${e.length}`);
        else if (typeof s == 'object' && !(0, bn.alwaysValidSchema)(i, s)) {
            let u = r.var('valid', (0, at._)`${a} <= ${e.length}`);
            r.if((0, at.not)(u), () => c(u)), t.ok(u);
        }
        function c(u) {
            r.forRange('i', e.length, a, (l) => {
                t.subschema({ keyword: o, dataProp: l, dataPropType: bn.Type.Num }, u),
                    i.allErrors || r.if((0, at.not)(u), () => r.break());
            });
        }
    }
    cr.validateAdditionalItems = ba;
    cr.default = bp;
});
var Pn = R((ur) => {
    'use strict';
    Object.defineProperty(ur, '__esModule', { value: !0 });
    ur.validateTuple = void 0;
    var Sa = j(),
        zr = F(),
        Sp = he(),
        Pp = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'array', 'boolean'],
            before: 'uniqueItems',
            code(t) {
                let { schema: e, it: r } = t;
                if (Array.isArray(e)) return Pa(t, 'additionalItems', e);
                (r.items = !0), !(0, zr.alwaysValidSchema)(r, e) && t.ok((0, Sp.validateArray)(t));
            },
        };
    function Pa(t, e, r = t.schema) {
        let { gen: s, parentSchema: n, data: o, keyword: i, it: a } = t;
        l(n),
            a.opts.unevaluated &&
                r.length &&
                a.items !== !0 &&
                (a.items = zr.mergeEvaluated.items(s, r.length, a.items));
        let c = s.name('valid'),
            u = s.const('len', (0, Sa._)`${o}.length`);
        r.forEach((f, g) => {
            (0, zr.alwaysValidSchema)(a, f) ||
                (s.if((0, Sa._)`${u} > ${g}`, () => t.subschema({ keyword: i, schemaProp: g, dataProp: g }, c)),
                t.ok(c));
        });
        function l(f) {
            let { opts: g, errSchemaPath: w } = a,
                h = r.length,
                m = h === f.minItems && (h === f.maxItems || f[e] === !1);
            if (g.strictTuples && !m) {
                let $ = `"${i}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${w}"`;
                (0, zr.checkStrictMode)(a, $, g.strictTuples);
            }
        }
    }
    ur.validateTuple = Pa;
    ur.default = Pp;
});
var Ra = R((Rn) => {
    'use strict';
    Object.defineProperty(Rn, '__esModule', { value: !0 });
    var Rp = Pn(),
        Op = {
            keyword: 'prefixItems',
            type: 'array',
            schemaType: ['array'],
            before: 'uniqueItems',
            code: (t) => (0, Rp.validateTuple)(t, 'items'),
        };
    Rn.default = Op;
});
var Ta = R((On) => {
    'use strict';
    Object.defineProperty(On, '__esModule', { value: !0 });
    var Oa = j(),
        Tp = F(),
        Np = he(),
        Cp = Sn(),
        Ap = {
            message: ({ params: { len: t } }) => (0, Oa.str)`must NOT have more than ${t} items`,
            params: ({ params: { len: t } }) => (0, Oa._)`{limit: ${t}}`,
        },
        Mp = {
            keyword: 'items',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            error: Ap,
            code(t) {
                let { schema: e, parentSchema: r, it: s } = t,
                    { prefixItems: n } = r;
                (s.items = !0),
                    !(0, Tp.alwaysValidSchema)(s, e) &&
                        (n ? (0, Cp.validateAdditionalItems)(t, n) : t.ok((0, Np.validateArray)(t)));
            },
        };
    On.default = Mp;
});
var Na = R((Tn) => {
    'use strict';
    Object.defineProperty(Tn, '__esModule', { value: !0 });
    var ge = j(),
        Hr = F(),
        Gp = {
            message: ({ params: { min: t, max: e } }) =>
                e === void 0
                    ? (0, ge.str)`must contain at least ${t} valid item(s)`
                    : (0, ge.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
            params: ({ params: { min: t, max: e } }) =>
                e === void 0 ? (0, ge._)`{minContains: ${t}}` : (0, ge._)`{minContains: ${t}, maxContains: ${e}}`,
        },
        jp = {
            keyword: 'contains',
            type: 'array',
            schemaType: ['object', 'boolean'],
            before: 'uniqueItems',
            trackErrors: !0,
            error: Gp,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t,
                    i,
                    a,
                    { minContains: c, maxContains: u } = s;
                o.opts.next ? ((i = c === void 0 ? 1 : c), (a = u)) : (i = 1);
                let l = e.const('len', (0, ge._)`${n}.length`);
                if ((t.setParams({ min: i, max: a }), a === void 0 && i === 0)) {
                    (0, Hr.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return;
                }
                if (a !== void 0 && i > a) {
                    (0, Hr.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), t.fail();
                    return;
                }
                if ((0, Hr.alwaysValidSchema)(o, r)) {
                    let m = (0, ge._)`${l} >= ${i}`;
                    a !== void 0 && (m = (0, ge._)`${m} && ${l} <= ${a}`), t.pass(m);
                    return;
                }
                o.items = !0;
                let f = e.name('valid');
                a === void 0 && i === 1
                    ? w(f, () => e.if(f, () => e.break()))
                    : i === 0
                      ? (e.let(f, !0), a !== void 0 && e.if((0, ge._)`${n}.length > 0`, g))
                      : (e.let(f, !1), g()),
                    t.result(f, () => t.reset());
                function g() {
                    let m = e.name('_valid'),
                        $ = e.let('count', 0);
                    w(m, () => e.if(m, () => h($)));
                }
                function w(m, $) {
                    e.forRange('i', 0, l, (_) => {
                        t.subschema(
                            { keyword: 'contains', dataProp: _, dataPropType: Hr.Type.Num, compositeRule: !0 },
                            m,
                        ),
                            $();
                    });
                }
                function h(m) {
                    e.code((0, ge._)`${m}++`),
                        a === void 0
                            ? e.if((0, ge._)`${m} >= ${i}`, () => e.assign(f, !0).break())
                            : (e.if((0, ge._)`${m} > ${a}`, () => e.assign(f, !1).break()),
                              i === 1 ? e.assign(f, !0) : e.if((0, ge._)`${m} >= ${i}`, () => e.assign(f, !0)));
                }
            },
        };
    Tn.default = jp;
});
var Ma = R((Ce) => {
    'use strict';
    Object.defineProperty(Ce, '__esModule', { value: !0 });
    Ce.validateSchemaDeps = Ce.validatePropertyDeps = Ce.error = void 0;
    var Nn = j(),
        kp = F(),
        lr = he();
    Ce.error = {
        message: ({ params: { property: t, depsCount: e, deps: r } }) => {
            let s = e === 1 ? 'property' : 'properties';
            return (0, Nn.str)`must have ${s} ${r} when property ${t} is present`;
        },
        params: ({ params: { property: t, depsCount: e, deps: r, missingProperty: s } }) => (0, Nn._)`{property: ${t},
    missingProperty: ${s},
    depsCount: ${e},
    deps: ${r}}`,
    };
    var Ip = {
        keyword: 'dependencies',
        type: 'object',
        schemaType: 'object',
        error: Ce.error,
        code(t) {
            let [e, r] = Dp(t);
            Ca(t, e), Aa(t, r);
        },
    };
    function Dp({ schema: t }) {
        let e = {},
            r = {};
        for (let s in t) {
            if (s === '__proto__') continue;
            let n = Array.isArray(t[s]) ? e : r;
            n[s] = t[s];
        }
        return [e, r];
    }
    function Ca(t, e = t.schema) {
        let { gen: r, data: s, it: n } = t;
        if (Object.keys(e).length === 0) return;
        let o = r.let('missing');
        for (let i in e) {
            let a = e[i];
            if (a.length === 0) continue;
            let c = (0, lr.propertyInData)(r, s, i, n.opts.ownProperties);
            t.setParams({ property: i, depsCount: a.length, deps: a.join(', ') }),
                n.allErrors
                    ? r.if(c, () => {
                          for (let u of a) (0, lr.checkReportMissingProp)(t, u);
                      })
                    : (r.if((0, Nn._)`${c} && (${(0, lr.checkMissingProp)(t, a, o)})`),
                      (0, lr.reportMissingProp)(t, o),
                      r.else());
        }
    }
    Ce.validatePropertyDeps = Ca;
    function Aa(t, e = t.schema) {
        let { gen: r, data: s, keyword: n, it: o } = t,
            i = r.name('valid');
        for (let a in e)
            (0, kp.alwaysValidSchema)(o, e[a]) ||
                (r.if(
                    (0, lr.propertyInData)(r, s, a, o.opts.ownProperties),
                    () => {
                        let c = t.subschema({ keyword: n, schemaProp: a }, i);
                        t.mergeValidEvaluated(c, i);
                    },
                    () => r.var(i, !0),
                ),
                t.ok(i));
    }
    Ce.validateSchemaDeps = Aa;
    Ce.default = Ip;
});
var ja = R((Cn) => {
    'use strict';
    Object.defineProperty(Cn, '__esModule', { value: !0 });
    var Ga = j(),
        qp = F(),
        xp = {
            message: 'property name must be valid',
            params: ({ params: t }) => (0, Ga._)`{propertyName: ${t.propertyName}}`,
        },
        Fp = {
            keyword: 'propertyNames',
            type: 'object',
            schemaType: ['object', 'boolean'],
            error: xp,
            code(t) {
                let { gen: e, schema: r, data: s, it: n } = t;
                if ((0, qp.alwaysValidSchema)(n, r)) return;
                let o = e.name('valid');
                e.forIn('key', s, (i) => {
                    t.setParams({ propertyName: i }),
                        t.subschema(
                            {
                                keyword: 'propertyNames',
                                data: i,
                                dataTypes: ['string'],
                                propertyName: i,
                                compositeRule: !0,
                            },
                            o,
                        ),
                        e.if((0, Ga.not)(o), () => {
                            t.error(!0), n.allErrors || e.break();
                        });
                }),
                    t.ok(o);
            },
        };
    Cn.default = Fp;
});
var Mn = R((An) => {
    'use strict';
    Object.defineProperty(An, '__esModule', { value: !0 });
    var Br = he(),
        we = j(),
        Vp = ke(),
        Wr = F(),
        Up = {
            message: 'must NOT have additional properties',
            params: ({ params: t }) => (0, we._)`{additionalProperty: ${t.additionalProperty}}`,
        },
        Lp = {
            keyword: 'additionalProperties',
            type: ['object'],
            schemaType: ['boolean', 'object'],
            allowUndefined: !0,
            trackErrors: !0,
            error: Up,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, errsCount: o, it: i } = t;
                if (!o) throw new Error('ajv implementation error');
                let { allErrors: a, opts: c } = i;
                if (((i.props = !0), c.removeAdditional !== 'all' && (0, Wr.alwaysValidSchema)(i, r))) return;
                let u = (0, Br.allSchemaProperties)(s.properties),
                    l = (0, Br.allSchemaProperties)(s.patternProperties);
                f(), t.ok((0, we._)`${o} === ${Vp.default.errors}`);
                function f() {
                    e.forIn('key', n, ($) => {
                        !u.length && !l.length ? h($) : e.if(g($), () => h($));
                    });
                }
                function g($) {
                    let _;
                    if (u.length > 8) {
                        let S = (0, Wr.schemaRefOrVal)(i, s.properties, 'properties');
                        _ = (0, Br.isOwnProperty)(e, S, $);
                    } else u.length ? (_ = (0, we.or)(...u.map((S) => (0, we._)`${$} === ${S}`))) : (_ = we.nil);
                    return (
                        l.length &&
                            (_ = (0, we.or)(_, ...l.map((S) => (0, we._)`${(0, Br.usePattern)(t, S)}.test(${$})`))),
                        (0, we.not)(_)
                    );
                }
                function w($) {
                    e.code((0, we._)`delete ${n}[${$}]`);
                }
                function h($) {
                    if (c.removeAdditional === 'all' || (c.removeAdditional && r === !1)) {
                        w($);
                        return;
                    }
                    if (r === !1) {
                        t.setParams({ additionalProperty: $ }), t.error(), a || e.break();
                        return;
                    }
                    if (typeof r == 'object' && !(0, Wr.alwaysValidSchema)(i, r)) {
                        let _ = e.name('valid');
                        c.removeAdditional === 'failing'
                            ? (m($, _, !1),
                              e.if((0, we.not)(_), () => {
                                  t.reset(), w($);
                              }))
                            : (m($, _), a || e.if((0, we.not)(_), () => e.break()));
                    }
                }
                function m($, _, S) {
                    let P = { keyword: 'additionalProperties', dataProp: $, dataPropType: Wr.Type.Str };
                    S === !1 && Object.assign(P, { compositeRule: !0, createErrors: !1, allErrors: !1 }),
                        t.subschema(P, _);
                }
            },
        };
    An.default = Lp;
});
var Da = R((jn) => {
    'use strict';
    Object.defineProperty(jn, '__esModule', { value: !0 });
    var Kp = Yt(),
        ka = he(),
        Gn = F(),
        Ia = Mn(),
        zp = {
            keyword: 'properties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, parentSchema: s, data: n, it: o } = t;
                o.opts.removeAdditional === 'all' &&
                    s.additionalProperties === void 0 &&
                    Ia.default.code(new Kp.KeywordCxt(o, Ia.default, 'additionalProperties'));
                let i = (0, ka.allSchemaProperties)(r);
                for (let f of i) o.definedProperties.add(f);
                o.opts.unevaluated &&
                    i.length &&
                    o.props !== !0 &&
                    (o.props = Gn.mergeEvaluated.props(e, (0, Gn.toHash)(i), o.props));
                let a = i.filter((f) => !(0, Gn.alwaysValidSchema)(o, r[f]));
                if (a.length === 0) return;
                let c = e.name('valid');
                for (let f of a)
                    u(f)
                        ? l(f)
                        : (e.if((0, ka.propertyInData)(e, n, f, o.opts.ownProperties)),
                          l(f),
                          o.allErrors || e.else().var(c, !0),
                          e.endIf()),
                        t.it.definedProperties.add(f),
                        t.ok(c);
                function u(f) {
                    return o.opts.useDefaults && !o.compositeRule && r[f].default !== void 0;
                }
                function l(f) {
                    t.subschema({ keyword: 'properties', schemaProp: f, dataProp: f }, c);
                }
            },
        };
    jn.default = zp;
});
var Va = R((kn) => {
    'use strict';
    Object.defineProperty(kn, '__esModule', { value: !0 });
    var qa = he(),
        Jr = j(),
        xa = F(),
        Fa = F(),
        Hp = {
            keyword: 'patternProperties',
            type: 'object',
            schemaType: 'object',
            code(t) {
                let { gen: e, schema: r, data: s, parentSchema: n, it: o } = t,
                    { opts: i } = o,
                    a = (0, qa.allSchemaProperties)(r),
                    c = a.filter((m) => (0, xa.alwaysValidSchema)(o, r[m]));
                if (a.length === 0 || (c.length === a.length && (!o.opts.unevaluated || o.props === !0))) return;
                let u = i.strictSchema && !i.allowMatchingProperties && n.properties,
                    l = e.name('valid');
                o.props !== !0 && !(o.props instanceof Jr.Name) && (o.props = (0, Fa.evaluatedPropsToName)(e, o.props));
                let { props: f } = o;
                g();
                function g() {
                    for (let m of a) u && w(m), o.allErrors ? h(m) : (e.var(l, !0), h(m), e.if(l));
                }
                function w(m) {
                    for (let $ in u)
                        new RegExp(m).test($) &&
                            (0, xa.checkStrictMode)(
                                o,
                                `property ${$} matches pattern ${m} (use allowMatchingProperties)`,
                            );
                }
                function h(m) {
                    e.forIn('key', s, ($) => {
                        e.if((0, Jr._)`${(0, qa.usePattern)(t, m)}.test(${$})`, () => {
                            let _ = c.includes(m);
                            _ ||
                                t.subschema(
                                    {
                                        keyword: 'patternProperties',
                                        schemaProp: m,
                                        dataProp: $,
                                        dataPropType: Fa.Type.Str,
                                    },
                                    l,
                                ),
                                o.opts.unevaluated && f !== !0
                                    ? e.assign((0, Jr._)`${f}[${$}]`, !0)
                                    : !_ && !o.allErrors && e.if((0, Jr.not)(l), () => e.break());
                        });
                    });
                }
            },
        };
    kn.default = Hp;
});
var Ua = R((In) => {
    'use strict';
    Object.defineProperty(In, '__esModule', { value: !0 });
    var Bp = F(),
        Wp = {
            keyword: 'not',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if ((0, Bp.alwaysValidSchema)(s, r)) {
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
    In.default = Wp;
});
var La = R((Dn) => {
    'use strict';
    Object.defineProperty(Dn, '__esModule', { value: !0 });
    var Jp = he(),
        Yp = {
            keyword: 'anyOf',
            schemaType: 'array',
            trackErrors: !0,
            code: Jp.validateUnion,
            error: { message: 'must match a schema in anyOf' },
        };
    Dn.default = Yp;
});
var Ka = R((qn) => {
    'use strict';
    Object.defineProperty(qn, '__esModule', { value: !0 });
    var Yr = j(),
        Qp = F(),
        Xp = {
            message: 'must match exactly one schema in oneOf',
            params: ({ params: t }) => (0, Yr._)`{passingSchemas: ${t.passing}}`,
        },
        Zp = {
            keyword: 'oneOf',
            schemaType: 'array',
            trackErrors: !0,
            error: Xp,
            code(t) {
                let { gen: e, schema: r, parentSchema: s, it: n } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                if (n.opts.discriminator && s.discriminator) return;
                let o = r,
                    i = e.let('valid', !1),
                    a = e.let('passing', null),
                    c = e.name('_valid');
                t.setParams({ passing: a }),
                    e.block(u),
                    t.result(
                        i,
                        () => t.reset(),
                        () => t.error(!0),
                    );
                function u() {
                    o.forEach((l, f) => {
                        let g;
                        (0, Qp.alwaysValidSchema)(n, l)
                            ? e.var(c, !0)
                            : (g = t.subschema({ keyword: 'oneOf', schemaProp: f, compositeRule: !0 }, c)),
                            f > 0 &&
                                e
                                    .if((0, Yr._)`${c} && ${i}`)
                                    .assign(i, !1)
                                    .assign(a, (0, Yr._)`[${a}, ${f}]`)
                                    .else(),
                            e.if(c, () => {
                                e.assign(i, !0), e.assign(a, f), g && t.mergeEvaluated(g, Yr.Name);
                            });
                    });
                }
            },
        };
    qn.default = Zp;
});
var za = R((xn) => {
    'use strict';
    Object.defineProperty(xn, '__esModule', { value: !0 });
    var eh = F(),
        th = {
            keyword: 'allOf',
            schemaType: 'array',
            code(t) {
                let { gen: e, schema: r, it: s } = t;
                if (!Array.isArray(r)) throw new Error('ajv implementation error');
                let n = e.name('valid');
                r.forEach((o, i) => {
                    if ((0, eh.alwaysValidSchema)(s, o)) return;
                    let a = t.subschema({ keyword: 'allOf', schemaProp: i }, n);
                    t.ok(n), t.mergeEvaluated(a);
                });
            },
        };
    xn.default = th;
});
var Wa = R((Fn) => {
    'use strict';
    Object.defineProperty(Fn, '__esModule', { value: !0 });
    var Qr = j(),
        Ba = F(),
        rh = {
            message: ({ params: t }) => (0, Qr.str)`must match "${t.ifClause}" schema`,
            params: ({ params: t }) => (0, Qr._)`{failingKeyword: ${t.ifClause}}`,
        },
        sh = {
            keyword: 'if',
            schemaType: ['object', 'boolean'],
            trackErrors: !0,
            error: rh,
            code(t) {
                let { gen: e, parentSchema: r, it: s } = t;
                r.then === void 0 &&
                    r.else === void 0 &&
                    (0, Ba.checkStrictMode)(s, '"if" without "then" and "else" is ignored');
                let n = Ha(s, 'then'),
                    o = Ha(s, 'else');
                if (!n && !o) return;
                let i = e.let('valid', !0),
                    a = e.name('_valid');
                if ((c(), t.reset(), n && o)) {
                    let l = e.let('ifClause');
                    t.setParams({ ifClause: l }), e.if(a, u('then', l), u('else', l));
                } else n ? e.if(a, u('then')) : e.if((0, Qr.not)(a), u('else'));
                t.pass(i, () => t.error(!0));
                function c() {
                    let l = t.subschema({ keyword: 'if', compositeRule: !0, createErrors: !1, allErrors: !1 }, a);
                    t.mergeEvaluated(l);
                }
                function u(l, f) {
                    return () => {
                        let g = t.subschema({ keyword: l }, a);
                        e.assign(i, a),
                            t.mergeValidEvaluated(g, i),
                            f ? e.assign(f, (0, Qr._)`${l}`) : t.setParams({ ifClause: l });
                    };
                }
            },
        };
    function Ha(t, e) {
        let r = t.schema[e];
        return r !== void 0 && !(0, Ba.alwaysValidSchema)(t, r);
    }
    Fn.default = sh;
});
var Ja = R((Vn) => {
    'use strict';
    Object.defineProperty(Vn, '__esModule', { value: !0 });
    var nh = F(),
        oh = {
            keyword: ['then', 'else'],
            schemaType: ['object', 'boolean'],
            code({ keyword: t, parentSchema: e, it: r }) {
                e.if === void 0 && (0, nh.checkStrictMode)(r, `"${t}" without "if" is ignored`);
            },
        };
    Vn.default = oh;
});
var Ya = R((Un) => {
    'use strict';
    Object.defineProperty(Un, '__esModule', { value: !0 });
    var ih = Sn(),
        ah = Ra(),
        ch = Pn(),
        uh = Ta(),
        lh = Na(),
        dh = Ma(),
        fh = ja(),
        ph = Mn(),
        hh = Da(),
        mh = Va(),
        gh = Ua(),
        yh = La(),
        _h = Ka(),
        Eh = za(),
        wh = Wa(),
        vh = Ja();
    function $h(t = !1) {
        let e = [
            gh.default,
            yh.default,
            _h.default,
            Eh.default,
            wh.default,
            vh.default,
            fh.default,
            ph.default,
            dh.default,
            hh.default,
            mh.default,
        ];
        return t ? e.push(ah.default, uh.default) : e.push(ih.default, ch.default), e.push(lh.default), e;
    }
    Un.default = $h;
});
var Qa = R((Ln) => {
    'use strict';
    Object.defineProperty(Ln, '__esModule', { value: !0 });
    var W = j(),
        bh = {
            message: ({ schemaCode: t }) => (0, W.str)`must match format "${t}"`,
            params: ({ schemaCode: t }) => (0, W._)`{format: ${t}}`,
        },
        Sh = {
            keyword: 'format',
            type: ['number', 'string'],
            schemaType: 'string',
            $data: !0,
            error: bh,
            code(t, e) {
                let { gen: r, data: s, $data: n, schema: o, schemaCode: i, it: a } = t,
                    { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = a;
                if (!c.validateFormats) return;
                n ? g() : w();
                function g() {
                    let h = r.scopeValue('formats', { ref: f.formats, code: c.code.formats }),
                        m = r.const('fDef', (0, W._)`${h}[${i}]`),
                        $ = r.let('fType'),
                        _ = r.let('format');
                    r.if(
                        (0, W._)`typeof ${m} == "object" && !(${m} instanceof RegExp)`,
                        () => r.assign($, (0, W._)`${m}.type || "string"`).assign(_, (0, W._)`${m}.validate`),
                        () => r.assign($, (0, W._)`"string"`).assign(_, m),
                    ),
                        t.fail$data((0, W.or)(S(), P()));
                    function S() {
                        return c.strictSchema === !1 ? W.nil : (0, W._)`${i} && !${_}`;
                    }
                    function P() {
                        let E = l.$async
                                ? (0, W._)`(${m}.async ? await ${_}(${s}) : ${_}(${s}))`
                                : (0, W._)`${_}(${s})`,
                            y = (0, W._)`(typeof ${_} == "function" ? ${E} : ${_}.test(${s}))`;
                        return (0, W._)`${_} && ${_} !== true && ${$} === ${e} && !${y}`;
                    }
                }
                function w() {
                    let h = f.formats[o];
                    if (!h) {
                        S();
                        return;
                    }
                    if (h === !0) return;
                    let [m, $, _] = P(h);
                    m === e && t.pass(E());
                    function S() {
                        if (c.strictSchema === !1) {
                            f.logger.warn(y());
                            return;
                        }
                        throw new Error(y());
                        function y() {
                            return `unknown format "${o}" ignored in schema at path "${u}"`;
                        }
                    }
                    function P(y) {
                        let N =
                                y instanceof RegExp
                                    ? (0, W.regexpCode)(y)
                                    : c.code.formats
                                      ? (0, W._)`${c.code.formats}${(0, W.getProperty)(o)}`
                                      : void 0,
                            V = r.scopeValue('formats', { key: o, ref: y, code: N });
                        return typeof y == 'object' && !(y instanceof RegExp)
                            ? [y.type || 'string', y.validate, (0, W._)`${V}.validate`]
                            : ['string', y, V];
                    }
                    function E() {
                        if (typeof h == 'object' && !(h instanceof RegExp) && h.async) {
                            if (!l.$async) throw new Error('async format in sync schema');
                            return (0, W._)`await ${_}(${s})`;
                        }
                        return typeof $ == 'function' ? (0, W._)`${_}(${s})` : (0, W._)`${_}.test(${s})`;
                    }
                }
            },
        };
    Ln.default = Sh;
});
var Xa = R((Kn) => {
    'use strict';
    Object.defineProperty(Kn, '__esModule', { value: !0 });
    var Ph = Qa(),
        Rh = [Ph.default];
    Kn.default = Rh;
});
var Za = R(($t) => {
    'use strict';
    Object.defineProperty($t, '__esModule', { value: !0 });
    $t.contentVocabulary = $t.metadataVocabulary = void 0;
    $t.metadataVocabulary = ['title', 'description', 'default', 'deprecated', 'readOnly', 'writeOnly', 'examples'];
    $t.contentVocabulary = ['contentMediaType', 'contentEncoding', 'contentSchema'];
});
var tc = R((zn) => {
    'use strict';
    Object.defineProperty(zn, '__esModule', { value: !0 });
    var Oh = ca(),
        Th = $a(),
        Nh = Ya(),
        Ch = Xa(),
        ec = Za(),
        Ah = [Oh.default, Th.default, (0, Nh.default)(), Ch.default, ec.metadataVocabulary, ec.contentVocabulary];
    zn.default = Ah;
});
var sc = R((Xr) => {
    'use strict';
    Object.defineProperty(Xr, '__esModule', { value: !0 });
    Xr.DiscrError = void 0;
    var rc;
    (function (t) {
        (t.Tag = 'tag'), (t.Mapping = 'mapping');
    })(rc || (Xr.DiscrError = rc = {}));
});
var oc = R((Bn) => {
    'use strict';
    Object.defineProperty(Bn, '__esModule', { value: !0 });
    var bt = j(),
        Hn = sc(),
        nc = jr(),
        Mh = Qt(),
        Gh = F(),
        jh = {
            message: ({ params: { discrError: t, tagName: e } }) =>
                t === Hn.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
            params: ({ params: { discrError: t, tag: e, tagName: r } }) =>
                (0, bt._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`,
        },
        kh = {
            keyword: 'discriminator',
            type: 'object',
            schemaType: 'object',
            error: jh,
            code(t) {
                let { gen: e, data: r, schema: s, parentSchema: n, it: o } = t,
                    { oneOf: i } = n;
                if (!o.opts.discriminator) throw new Error('discriminator: requires discriminator option');
                let a = s.propertyName;
                if (typeof a != 'string') throw new Error('discriminator: requires propertyName');
                if (s.mapping) throw new Error('discriminator: mapping is not supported');
                if (!i) throw new Error('discriminator: requires oneOf keyword');
                let c = e.let('valid', !1),
                    u = e.const('tag', (0, bt._)`${r}${(0, bt.getProperty)(a)}`);
                e.if(
                    (0, bt._)`typeof ${u} == "string"`,
                    () => l(),
                    () => t.error(!1, { discrError: Hn.DiscrError.Tag, tag: u, tagName: a }),
                ),
                    t.ok(c);
                function l() {
                    let w = g();
                    e.if(!1);
                    for (let h in w) e.elseIf((0, bt._)`${u} === ${h}`), e.assign(c, f(w[h]));
                    e.else(), t.error(!1, { discrError: Hn.DiscrError.Mapping, tag: u, tagName: a }), e.endIf();
                }
                function f(w) {
                    let h = e.name('valid'),
                        m = t.subschema({ keyword: 'oneOf', schemaProp: w }, h);
                    return t.mergeEvaluated(m, bt.Name), h;
                }
                function g() {
                    var w;
                    let h = {},
                        m = _(n),
                        $ = !0;
                    for (let E = 0; E < i.length; E++) {
                        let y = i[E];
                        if (y?.$ref && !(0, Gh.schemaHasRulesButRef)(y, o.self.RULES)) {
                            let V = y.$ref;
                            if (
                                ((y = nc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, V)),
                                y instanceof nc.SchemaEnv && (y = y.schema),
                                y === void 0)
                            )
                                throw new Mh.default(o.opts.uriResolver, o.baseId, V);
                        }
                        let N = (w = y?.properties) === null || w === void 0 ? void 0 : w[a];
                        if (typeof N != 'object')
                            throw new Error(
                                `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`,
                            );
                        ($ = $ && (m || _(y))), S(N, E);
                    }
                    if (!$) throw new Error(`discriminator: "${a}" must be required`);
                    return h;
                    function _({ required: E }) {
                        return Array.isArray(E) && E.includes(a);
                    }
                    function S(E, y) {
                        if (E.const) P(E.const, y);
                        else if (E.enum) for (let N of E.enum) P(N, y);
                        else throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
                    }
                    function P(E, y) {
                        if (typeof E != 'string' || E in h)
                            throw new Error(`discriminator: "${a}" values must be unique strings`);
                        h[E] = y;
                    }
                }
            },
        };
    Bn.default = kh;
});
var ic = R((Y_, Ih) => {
    Ih.exports = {
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
var cc = R((H, Wn) => {
    'use strict';
    Object.defineProperty(H, '__esModule', { value: !0 });
    H.MissingRefError =
        H.ValidationError =
        H.CodeGen =
        H.Name =
        H.nil =
        H.stringify =
        H.str =
        H._ =
        H.KeywordCxt =
        H.Ajv =
            void 0;
    var Dh = ra(),
        qh = tc(),
        xh = oc(),
        ac = ic(),
        Fh = ['/properties'],
        Zr = 'http://json-schema.org/draft-07/schema',
        St = class extends Dh.default {
            _addVocabularies() {
                super._addVocabularies(),
                    qh.default.forEach((e) => this.addVocabulary(e)),
                    this.opts.discriminator && this.addKeyword(xh.default);
            }
            _addDefaultMetaSchema() {
                if ((super._addDefaultMetaSchema(), !this.opts.meta)) return;
                let e = this.opts.$data ? this.$dataMetaSchema(ac, Fh) : ac;
                this.addMetaSchema(e, Zr, !1), (this.refs['http://json-schema.org/schema'] = Zr);
            }
            defaultMeta() {
                return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(Zr) ? Zr : void 0));
            }
        };
    H.Ajv = St;
    Wn.exports = H = St;
    Wn.exports.Ajv = St;
    Object.defineProperty(H, '__esModule', { value: !0 });
    H.default = St;
    var Vh = Yt();
    Object.defineProperty(H, 'KeywordCxt', {
        enumerable: !0,
        get: function () {
            return Vh.KeywordCxt;
        },
    });
    var Pt = j();
    Object.defineProperty(H, '_', {
        enumerable: !0,
        get: function () {
            return Pt._;
        },
    });
    Object.defineProperty(H, 'str', {
        enumerable: !0,
        get: function () {
            return Pt.str;
        },
    });
    Object.defineProperty(H, 'stringify', {
        enumerable: !0,
        get: function () {
            return Pt.stringify;
        },
    });
    Object.defineProperty(H, 'nil', {
        enumerable: !0,
        get: function () {
            return Pt.nil;
        },
    });
    Object.defineProperty(H, 'Name', {
        enumerable: !0,
        get: function () {
            return Pt.Name;
        },
    });
    Object.defineProperty(H, 'CodeGen', {
        enumerable: !0,
        get: function () {
            return Pt.CodeGen;
        },
    });
    var Uh = Mr();
    Object.defineProperty(H, 'ValidationError', {
        enumerable: !0,
        get: function () {
            return Uh.default;
        },
    });
    var Lh = Qt();
    Object.defineProperty(H, 'MissingRefError', {
        enumerable: !0,
        get: function () {
            return Lh.default;
        },
    });
});
var Hh = {};
Vc(Hh, { handleHttp: () => Kh, handleInvoke: () => zh, schema: () => dc });
module.exports = Lc(Hh);
var ns = (t, e) => {
        let r = e.get(t);
        return r || ((r = new Map()), e.set(t, r)), r;
    },
    Kc = (t, e, r) => (r.set(t, e), r),
    pr = (t, e, r, s) => {
        let n = ns(t, s);
        return Kc(e, r, n), s;
    },
    xe = (t, e, r, s, n) => {
        let o = ns(t, n);
        return pr(e, r, s, o), n;
    },
    hr = (t, e, r, s, n, o) => {
        let i = ns(t, o);
        return xe(e, r, s, n, i), o;
    };
var Ae = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': 'true',
};
var zc = (t) => Buffer.from(t, 'base64').toString('utf-8'),
    oo = (t) => {
        let e = t.split('.');
        return JSON.parse(zc(e[1]));
    },
    io = (t, e) => {
        try {
            return JSON.parse(e);
        } catch {
            return t;
        }
    },
    ao = (t, e) => {
        let r = t.indexOf(e);
        return r === -1 ? t : t.substring(0, r);
    };
var ct = (t) => ({ statusCode: 403, headers: Ae, body: typeof t == 'string' ? t : JSON.stringify(t) });
var be = (t) => ({ statusCode: 400, headers: Ae, body: typeof t == 'string' ? t : JSON.stringify(t) }),
    co = (t) => ({ statusCode: 401, headers: Ae, body: t ? JSON.stringify(t) : 'Unauthorized' }),
    uo = (t) => ({ statusCode: 404, headers: Ae, body: t ? JSON.stringify(t) : 'Not Found' }),
    lo = (t) => ({ statusCode: 422, headers: Ae, body: t ? JSON.stringify(t) : 'Unprocessable Entity' }),
    os = (t) => (t.statusCode ? t : (console.error(t), { statusCode: 500, headers: Ae, body: t.message }));
var em = be({
        name: 'InvalidEmailError',
        message: 'The email must be valid and must not contain upper case letters or spaces.',
    }),
    tm = be({
        name: 'InvalidPasswordError',
        message: 'The password must contain at least 8 characters and at least 1 number.',
    }),
    rm = be({
        name: 'InvalidSrpAError',
        message: 'The SRP A value must be a correctly calculated random hex hash based on big integers.',
    }),
    sm = be({ name: 'InvalidRefreshTokenError', message: 'Refresh token is invalid.' }),
    nm = be({ name: 'VerificationCodeMismatchError', message: 'The verification code does not match.' }),
    om = ct({
        name: 'VerificationCodeExpiredError',
        message:
            'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
    }),
    im = uo({ name: 'UserNotFoundError', message: 'No user was found under the given email or user ID.' }),
    am = ct({ name: 'UserNotVerifiedError', message: 'The user must be verified with Register Verify operation.' }),
    cm = ct({ name: 'UserExistsError', message: 'There is an existing user with the given email address.' }),
    um = be({
        name: 'UserMissingPasswordChallengeError',
        message: 'The user must have an active require password change challenge.',
    }),
    lm = ct({ name: 'PasswordResetRequiredError', message: 'The password must be reset.' }),
    dm = lo({
        name: 'PasswordResetMissingParamError',
        message: 'Either a verification code or the users old password are required.',
    }),
    fm = ct({
        name: 'LoginVerifyError',
        message:
            'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
    });
var mr = process.env.AWS_REGION || '',
    fo = process.env.ADMIN_EMAILS || '',
    Tt = process.env.CLOUDFRONT_ACCESS_KEY_ID || '',
    ut = process.env.CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER || '',
    hm = process.env.INVITE_USER_VALIDATION_VIEW || '',
    mm = process.env.PULL_LAMBDA_NAME || '',
    lt = process.env.MEDIA_DOMAIN || '',
    gm = process.env.CLIENT_ID || '',
    ym = process.env.USER_POOL_ID || '';
var po = require('crypto'),
    ho = (t) => (0, po.createHash)('sha256').update(t).digest('hex');
var mo = (t = 100) => {
    let e = [],
        r = 0,
        s = 0,
        n = 0,
        o = (l) => {
            (e[s] = l), (s += 1);
        },
        i = () => {
            let l = e[r];
            return delete e[r], (r += 1), l;
        },
        a = () => s - r,
        c = (l) => {
            let f = new Promise((g, w) => {
                o(async () => {
                    await l().then(g).catch(w);
                });
            });
            return u(), f;
        },
        u = async () => {
            if (n < t && a() > 0) {
                let l = i();
                (n += 1), l && (await l()), (n -= 1), u();
            }
        };
    return { queueLoad: c, length: a };
};
var gr = (t, e, r) => {
        let s = r.get(t);
        if (s != null) return s.get(e);
    },
    is = (t, e, r, s) => {
        let n = s.get(t);
        if (n != null) return gr(e, r, n);
    };
var Fe = (t) => {
    if (typeof t == 'string') return t;
    let e = '{';
    if (t.keys != null) {
        let r = t,
            s = r.keys(),
            n = r.size,
            o = 0;
        for (let i of s) {
            let a = r.get(i);
            o < n - 1 ? (e += `"${i}":${Fe(a)},`) : (e += `"${i}":${Fe(a)}`), (o += 1);
        }
    } else {
        let r = t,
            s = Object.keys(r);
        for (let n = 0; n < s.length; n++) {
            let o = s[n];
            n < s.length - 1 ? (e += `"${o}":${Fe(r[o])},`) : (e += `"${o}":${Fe(r[o])}`);
        }
    }
    return (e += '}'), e;
};
var Se = (t, e) => (e === void 0 ? t : e && (e === !0 ? t || e : !t || t === !0 ? e : { ...t, ...e })),
    Nt = (t, e) => {
        if (typeof t != 'object' || typeof e != 'object' || t === null || e === null) return e;
        let r = {},
            s = Object.keys(t);
        for (let o = 0; o < s.length; o += 1) {
            let i = s[o],
                a = t[i],
                c = e[i];
            r[i] = i in e ? Nt(a, c) : a;
        }
        let n = Object.keys(e);
        for (let o = 0; o < n.length; o += 1) {
            let i = n[o];
            i in r || (r[i] = e[i]);
        }
        return r;
    },
    fe = (t, e, r = 1, s = []) => {
        if (!t) return;
        let n = Object.keys(t);
        for (let o = 0; o < n.length; o += 1) {
            let i = n[o],
                a = t[i];
            r === 1 ? e(a, [...s, i]) : a && typeof a == 'object' && fe(a, e, r - 1, [...s, i]);
        }
    },
    Ct = (t, e, r) => {
        if (!r) return t;
        try {
            let s = r;
            for (let n = 0; n < e.length; n += 1) {
                let o = e[n];
                if (o in s) s = s[o];
                else return t;
            }
            return s;
        } catch {
            return t;
        }
    },
    Me = (t, e, r) => {
        if (t.length === 0) return e;
        let s = r;
        for (let o = 0; o < t.length - 1; o += 1) {
            let i = t[o];
            i in s || (s[i] = {}), (s = s[i]);
        }
        let n = t[t.length - 1];
        return (s[n] = e), r;
    },
    as = (t, e) => {
        let r = e;
        for (let n = 0; n < t.length - 1; n += 1) {
            let o = t[n];
            o in r || (r[o] = {}), (r = r[o]);
        }
        let s = t[t.length - 1];
        return delete r[s], e;
    };
var Dm = {
    view: JSON.stringify(
        {
            'todo-list1': {
                include: { node: !0, rights: !0 },
                edges: { 'todo-list/todo': { include: { edges: !0, metadata: !0 } } },
            },
        },
        null,
        2,
    ),
    graph: JSON.stringify({ nodes: { node1: { id: 'node1', someProp: 'someValue' } } }, null, 2),
    node: JSON.stringify({ id: 'todo123', text: 'buy groceries' }, null, 2),
    rights: JSON.stringify({ read: !0, write: !0, admin: !1 }, null, 2),
};
var At = (t, e) => (r, s) => {
        if (!s) return r;
        let n = r ?? {};
        return (
            fe(
                s,
                (o, i) => {
                    if (o === void 0) Me(i, void 0, n);
                    else {
                        let a = Ct(void 0, i, r),
                            c = e(a, o);
                        Me(i, c, n);
                    }
                },
                t,
            ),
            n
        );
    },
    Jm = At(1, Se),
    Ym = At(4, Se),
    Qm = At(1, Nt),
    Xm = At(1, Se),
    Zm = At(1, Nt);
var Mt = (t) => (e, r) => {
        if (!r) return e;
        let s = e ?? {};
        return (
            fe(
                r,
                (n, o) => {
                    if (n === void 0) {
                        as(o, s);
                        return;
                    }
                    if (n === !1 || typeof n == 'object') {
                        Me(o, n, s);
                        return;
                    }
                    let i = Ct(void 0, o, e);
                    if (!(n === !0 && typeof i == 'object')) {
                        Me(o, n, s);
                        return;
                    }
                    Me(o, i, s);
                },
                t,
            ),
            s
        );
    },
    eg = Mt(1),
    tg = Mt(4),
    rg = Mt(1),
    sg = Mt(1),
    ng = Mt(5);
var _o = () => {
    let t = [];
    return {
        addPromise: (s) => (t.push(s), s),
        awaitPromises: async () => {
            for (; !(t.length <= 0); ) {
                let s = t;
                (t = []), await Promise.all(s);
            }
        },
    };
};
var Eo = process.env.BUCKET_LOGS || '',
    Je = process.env.BUCKET_EDGES || '',
    Gt = process.env.BUCKET_REVERSE_EDGES || '',
    dt = process.env.BUCKET_NODES || '',
    yr = process.env.BUCKET_OWNERS || '',
    jt = process.env.BUCKET_RIGHTS_ADMIN || '',
    kt = process.env.BUCKET_RIGHTS_READ || '',
    It = process.env.BUCKET_RIGHTS_WRITE || '',
    ee = process.env.BUCKET_MEDIA || '';
var $o = require('@aws-sdk/s3-request-presigner'),
    Y = require('@aws-sdk/client-s3');
var _r = require('@aws-sdk/client-ssm');
var ou = new _r.SSMClient({ region: mr, apiVersion: 'latest' }),
    Er = async (t, e = !1) => {
        let r = new _r.GetParameterCommand({ Name: t, WithDecryption: e });
        try {
            let s = await ou.send(r);
            return s.Parameter ? s.Parameter.Value : void 0;
        } catch (s) {
            console.error(s);
            return;
        }
    };
var wo = require('@aws-sdk/cloudfront-signer'),
    iu = () => {
        let t = null;
        return async () => (t || (t = Er(ut || 'CLOUDFRONT_ACCESS_KEY', !0).catch(console.error)), t);
    },
    au = iu(),
    cu = 1 * 24 * 60 * 60 * 1e3,
    vo = async (t, e = cu) => {
        let r = await au();
        if (Tt && r)
            return (0, wo.getSignedUrl)({
                url: t,
                keyPairId: Tt,
                dateLessThan: new Date(Date.now() + e).toDateString(),
                privateKey: r,
            });
        throw new Error('Could not sign URL because of missing cloudfront keys.');
    };
var Ye = new Y.S3Client({ region: mr, apiVersion: 'latest' }),
    uu = (t) =>
        new Promise((e, r) => {
            let s = [];
            t.on('data', (n) => s.push(n)), t.on('error', r), t.on('end', () => e(Buffer.concat(s)));
        }),
    Pe = async (t, e, r) => {
        let s = r ? Buffer.from(JSON.stringify(r)) : void 0,
            n = new Y.PutObjectCommand({ Bucket: t, Key: e, Body: s });
        try {
            await Ye.send(n);
            return;
        } catch (o) {
            console.error(o);
            return;
        }
    };
var lu = async (t, e, { contentType: r }) => {
        let s = new Y.CreateMultipartUploadCommand({
            Bucket: t,
            Key: e,
            ContentType: r,
            CacheControl: 'max-age=31557600',
        });
        try {
            return (await Ye.send(s)).UploadId;
        } catch (n) {
            console.error(n);
            return;
        }
    },
    du = async (t, e, { uploadId: r, partNumber: s }) => {
        let n = new Y.UploadPartCommand({ Bucket: t, Key: e, UploadId: r, PartNumber: s });
        try {
            return (0, $o.getSignedUrl)(Ye, n, { expiresIn: 3600 });
        } catch (o) {
            console.error(o);
            return;
        }
    },
    bo = async (t, e, { contentType: r, fileSize: s, partSize: n }) => {
        let o = await lu(t, e, { contentType: r });
        if (!o) {
            console.error('Could not create multipart upload.');
            return;
        }
        try {
            let i = [];
            for (let c = 0; c < Math.ceil(s / n); c++)
                ut
                    ? i.push(vo(`https://${lt}/${e}?partNumber=${c + 1}&uploadId=${o || ''}`))
                    : i.push(du(t, e, { uploadId: o, partNumber: c + 1 }));
            let a = await Promise.all(i);
            return { uploadId: o, uploadUrls: a };
        } catch (i) {
            console.error(i);
            return;
        }
    };
var Qe = async (t, e) => {
        let r = new Y.GetObjectCommand({ Bucket: t, Key: e });
        try {
            let s = await Ye.send(r);
            return s.Body ? uu(s.Body) : null;
        } catch {
            return;
        }
    },
    Ve = async (t, e) => {
        let r = new Y.DeleteObjectCommand({ Bucket: t, Key: e });
        try {
            await Ye.send(r);
            return;
        } catch {
            return;
        }
    };
var us = async (t, e) => {
    let r = new Y.HeadObjectCommand({ Bucket: t, Key: e });
    try {
        let s = await Ye.send(r);
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
var fu = (t, e) => ({
        subscribe: (r) => {
            try {
                let s = async (n) => {
                    let o = new Y.ListObjectsV2Command({ Bucket: t, Prefix: e, ContinuationToken: n }),
                        i = await Ye.send(o).then(({ Contents: a, NextContinuationToken: c }) => (r.next(a || []), c));
                    i ? s(i) : r.complete();
                };
                s();
            } catch (s) {
                r.error(s);
            }
        },
    }),
    pu = async (t, e, r) =>
        new Promise((s, n) => {
            fu(t, e).subscribe({
                next: (o) =>
                    o.forEach(({ Key: i, ETag: a }) => {
                        i && a && r(i, a);
                    }),
                complete: () => s(!0),
                error: (o) => n(o),
            });
        }),
    Re = async (t, e) => {
        let r = [];
        return (
            await pu(t, e, (s) => {
                r.push(s);
            }),
            r
        );
    };
var So = async (t, e, r, s, n) => {
    let o = performance.now(),
        { awaitPromises: i } = _o(),
        { signer: a, loader: c, writer: u, graphAssembler: l, changelogAssembler: f } = n,
        {
            writeNode: g,
            writeMetadata: w,
            writePrincipalRight: h,
            writeInheritRight: m,
            writeFiles: $,
            getGraphJson: _,
            getLog: S,
        } = l,
        { writeNode: P, writeMetadata: E, writePrincipalRight: y, writeFiles: N, getGraphJson: V } = f,
        ve = 0,
        de = 0,
        J = 0,
        B = async (d) => (await c.getNode(d)) != null,
        $e = (d) => c.getRead(d, 'user', e),
        Rt = (d) => c.getWrite(d, 'user', e),
        es = (d) => c.getAdmin(d, 'user', e),
        Jn = async (d) => d === 'public' || (await $e(d)),
        pc = (d, p) => c.getWrite(d, 'role', p),
        hc = (d, p) => c.getAdmin(d, 'role', p),
        Ot = async (d) =>
            s ? B(d) : r === 'user' ? (await B(d)) && (await Rt(d)) : (await B(d)) && (await Jn(r)) && (await pc(d, r)),
        Yn = async (d) =>
            s ? B(d) : r === 'user' ? (await B(d)) && (await es(d)) : (await B(d)) && (await Jn(r)) && (await hc(d, r)),
        mc = (d) => {
            let p = d.slice(0, -1).lastIndexOf('.');
            return p === -1 ? '' : d.substring(0, p + 1);
        },
        gc = async (d) => {
            let p = mc(d);
            return r === 'user' ? !p || Rt(p) : !p || (await Ot(d));
        },
        Qn = (d) => {
            let p = Object.keys(d);
            for (let b = 0; b < p.length; b++) {
                let v = p[b];
                d[v] === null && delete d[v];
            }
            return d;
        },
        ts = async (d, p, b, v) => {
            !!(await c.getRead(d, p, b)) !== v &&
                (v
                    ? (await u.setRead(d, p, b, !0), y(d, p, b, 'read', 'true'))
                    : (await u.setRead(d, p, b, !1), y(d, p, b, 'read', 'false')));
        },
        rs = async (d, p, b, v) => {
            !!(await c.getWrite(d, p, b)) !== v &&
                (v
                    ? (await u.setWrite(d, p, b, !0), y(d, p, b, 'write', 'true'))
                    : (await u.setWrite(d, p, b, !1), y(d, p, b, 'write', 'false')));
        },
        ss = async (d, p, b, v) => {
            !!(await c.getAdmin(d, p, b)) !== v &&
                (v
                    ? (await u.setAdmin(d, p, b, !0), y(d, p, b, 'admin', 'true'))
                    : (await u.setAdmin(d, p, b, !1), y(d, p, b, 'admin', 'false')));
        },
        yc = async (d, p) => u.setOwner(d, p),
        Xn = async (d, p) => {
            let b = await c.getNode(d);
            if (!b && p) await u.setNode(d, p), P(d, `{"old":null,"new":${JSON.stringify(p)}}`);
            else if (b && !p) await u.setNode(d, null), P(d, `{"old":${b},"new":null}`);
            else if (b && p) {
                let v = JSON.parse(b),
                    O = Se(v, p);
                typeof O == 'object' && Qn(O), await u.setNode(d, O), P(d, `{"old":${b},"new":${JSON.stringify(O)}}`);
            }
        },
        _c = async (d, p) => {
            let b = r === 'user' ? 'user' : 'role',
                v = r === 'user' ? e : r;
            await Promise.all([Xn(d, p), ts(d, b, v, !0), rs(d, b, v, !0), ss(d, b, v, !0), yc(d, e)]);
        },
        Ec = async (d, p) => {
            if (await Ot(d)) {
                await Xn(d, p || null), g(d, '{"statusCode":200}');
                return;
            }
            if (p && (await gc(d)) && !(await c.ownerExists(d))) {
                await _c(d, p), g(d, '{"statusCode":200}');
                return;
            }
            g(d, '{"statusCode":403}');
        },
        wc = () => {
            let d = t.nodes;
            if (!d) return;
            let p = Object.keys(d),
                b = new Array(p.length);
            for (let v = 0; v < p.length; v++) {
                let O = p[v],
                    M = d[O];
                b[v] = Ec(O, M);
            }
            return Promise.all(b);
        },
        vc = async (d, p, b, v, O) => {
            let M = await c.getMetadata(d, `${p}/${b}`, v);
            if (!M && O)
                await u.setMetadata(d, `${p}/${b}`, v, O),
                    await u.setReverseEdge(v, `${b}/${p}`, d, !0),
                    E(d, p, b, v, `{"old":null,"new":${JSON.stringify(O)}}`);
            else if (M && !O)
                await u.setMetadata(d, `${p}/${b}`, v, !1),
                    await u.setReverseEdge(v, `${b}/${p}`, d, !1),
                    E(d, p, b, v, `{"old":${M},"new":null}`);
            else if (M && O) {
                let I = JSON.parse(M),
                    U = Se(I, O);
                typeof U == 'object' && Qn(U),
                    await u.setMetadata(d, `${p}/${b}`, v, U),
                    E(d, p, b, v, `{"old":${M},"new":${JSON.stringify(U)}}`);
            }
        },
        $c = async (d, p, b, v, O) => {
            let M = Ot(d),
                I = Ot(v);
            (await M) && (await I)
                ? (await vc(d, p, b, v, O), w(d, p, b, v, '{"statusCode":200}'))
                : w(d, p, b, v, '{"statusCode":403}');
        },
        bc = () => {
            let d = t.edges;
            if (!d) return;
            let p = [];
            return (
                fe(
                    d,
                    (b, v) => {
                        let [O, M, I, U] = v;
                        p.push($c(M, O, I, U, b));
                    },
                    4,
                ),
                Promise.all(p)
            );
        },
        Zn = (d, p, b, v) => {
            let O = [],
                M = new Set();
            if (d) for (let I of d.keys()) M.add(I);
            if (p) for (let I of p.keys()) M.add(I);
            for (let I of M) {
                let U = d?.get(I)?.get('read') === 'true',
                    Z = p?.get(I)?.get('read') === 'true';
                U !== Z && O.push(ts(v, b, I, U));
                let qe = d?.get(I)?.get('write') === 'true',
                    dr = p?.get(I)?.get('write') === 'true';
                qe !== dr && O.push(rs(v, b, I, qe));
                let so = d?.get(I)?.get('admin') === 'true',
                    kc = p?.get(I)?.get('admin') === 'true';
                so !== kc && O.push(ss(v, b, I, so));
            }
            return Promise.all(O);
        },
        Sc = async (d, p) => {
            if (await Yn(p)) {
                let v = await c.listRights(d),
                    O = v.get('user'),
                    M = v.get('role'),
                    I = await c.listRights(p),
                    U = I.get('user'),
                    Z = I.get('role');
                await Zn(O, U, 'user', p), await Zn(M, Z, 'role', p), m(p, '{"statusCode":200}');
            } else m(p, '{"statusCode":403}');
        },
        Pc = () => {
            let d = t.rights;
            if (!d) return;
            let p = Object.keys(d),
                b = [];
            for (let v = 0; v < p.length; v++) {
                let O = p[v],
                    M = d[O]?.inherit?.from;
                M && b.push(Sc(M, O));
            }
            return Promise.all(b);
        },
        eo = async (d, p, b, v, O) => {
            v === 'read'
                ? await ts(d, p, b, O)
                : v === 'write'
                  ? await rs(d, p, b, O)
                  : v === 'admin' && (await ss(d, p, b, O)),
                h(d, p, b, v, '{"statusCode":200}');
        },
        Rc = async (d, p) => {
            if (await Yn(d)) {
                let v = [],
                    O = p.user;
                O &&
                    fe(
                        O,
                        (I, U) => {
                            let [Z, qe] = U;
                            v.push(eo(d, 'user', Z, qe, I));
                        },
                        2,
                    );
                let M = p.role;
                M &&
                    fe(
                        M,
                        (I, U) => {
                            let [Z, qe] = U;
                            v.push(eo(d, 'role', Z, qe, I));
                        },
                        2,
                    ),
                    await Promise.all(v);
            } else {
                let v = p.user;
                v &&
                    fe(
                        v,
                        (M, I) => {
                            let [U, Z] = I;
                            h(d, 'user', U, Z, '{"statusCode":403}');
                        },
                        2,
                    );
                let O = p.role;
                O &&
                    fe(
                        O,
                        (M, I) => {
                            let [U, Z] = I;
                            h(d, 'role', U, Z, '{"statusCode":403}');
                        },
                        2,
                    );
            }
        },
        Oc = () => {
            let d = t.rights;
            if (!d) return;
            let p = Object.keys(d),
                b = [];
            for (let v = 0; v < p.length; v++) {
                let O = p[v],
                    M = d[O];
                b.push(Rc(O, M));
            }
            return Promise.all(b);
        },
        to = async (d, p, b) => {
            let v = await c.getFileRef(d, p);
            if (!v && b) {
                let O = { fileKey: b };
                await u.setFileRef(d, p, O), N(d, p, `{"old":null,"new":${JSON.stringify(O)}}`);
            } else if (v && !b) await u.setFileRef(d, p, null), N(d, p, `{"old":${JSON.stringify(v)},"new":null}`);
            else if (v && b) {
                let O = { fileKey: b };
                await u.setFileRef(d, p, O), N(d, p, `{"old":${JSON.stringify(v)},"new":${JSON.stringify(O)}}`);
            }
        },
        Tc = async (d, p) => {
            let b = await c.getFileMetadata(d);
            if (!b && p) await u.setFileMetadata(d, p);
            else if (b && !p) await u.setFileMetadata(d, null);
            else if (b && p) {
                let v = Se(b, p);
                await u.setFileMetadata(d, v);
            }
        },
        Nc = async (d, p, b) => {
            let { filename: v, contentType: O, fileSize: M, partSize: I = 5242880 } = b,
                U = `file/${ho(`${d}/${p}`)}/${v}`;
            if (
                (await to(d, p, U),
                await Tc(U, { nodeId: d, prop: p, filename: v, contentType: O, fileSize: M }),
                M > I)
            ) {
                let Z = await bo(ee, U, { contentType: O, fileSize: M, partSize: I });
                if (!Z) {
                    $(d, p, '{"statusCode":500}');
                    return;
                }
                let { uploadUrls: qe, uploadId: dr } = Z;
                await u.setUploadId(dr, U),
                    $(d, p, `{"statusCode":200,"uploadId":"${dr}","uploadUrls":${JSON.stringify(qe)}}`);
            } else {
                let Z = a.signUrl(`https://${lt}/${U}`);
                $(d, p, `{"statusCode":200,"uploadUrls":["${Z}"]}`);
            }
        },
        Cc = async (d, p) => {
            await to(d, p, null);
        },
        Ac = async (d, p) => {
            if (await Ot(d)) {
                let v = Object.keys(p),
                    O = new Array(v.length);
                for (let M = 0; M < v.length; M++) {
                    let I = v[M],
                        U = p[I];
                    U ? O.push(Nc(d, I, U)) : O.push(Cc(d, I));
                }
                await Promise.all(O);
            } else {
                let v = Object.keys(p);
                for (let O = 0; O < v.length; O++) $(d, v[O], '{"statusCode":403}');
            }
        },
        Mc = () => {
            let d = t.files;
            if (!d) return;
            let p = Object.keys(d),
                b = new Array(p.length);
            for (let v = 0; v < p.length; v++) {
                let O = p[v],
                    M = d[O];
                M && (b[v] = Ac(O, M));
            }
            return Promise.all(b);
        };
    await wc(), await bc(), await Pc(), await Oc(), await Mc(), await i(), await u.setPushLog(e, 'requestId', V());
    let ro = _(),
        Gc = V(),
        jc = {
            graphAssembler: S(),
            loader: c.getLog(),
            request: {
                payloadBytes: ro.length,
                time: performance.now() - o,
                sendTime: 0,
                timeQueryNode: ve,
                timeQueryEdge: de,
                timeLoadEdge: J,
            },
        };
    return [ro, Gc, jc];
};
var { queueLoad: le } = mo(200),
    hu = async (t) => Re(dt, t),
    mu = async (t, e) => Re(Je, `${t}/${e}/`),
    gu = async (t, e) => Re(Gt, `${t}/${e}/`),
    yu = async (t, e) => {
        let r = ao(e, '*'),
            s = await Re(Je, `${t}/${r}`),
            n = new RegExp(e.replaceAll('*', '.*').replaceAll('/', '\\/'));
        return r.length < e.length - 2 ? s.filter((o) => o.match(n)) : s;
    },
    _u = async (t) => {
        let [, , e] = t.split('/'),
            r = await Qe(ee, t),
            { fileKey: s = '' } = r ? JSON.parse(r.toString()) : {};
        return { prop: e, fileKey: s };
    },
    Eu = async (t) => {
        let e = await Re(ee, `ref/${t}`),
            r = new Array(e.length);
        for (let s = 0; s < e.length; s++) r[s] = _u(e[s]);
        return Promise.all(r);
    },
    Po = () => {
        let t = 0,
            e = 0,
            r = 0,
            s = async (S) => {
                t += 1;
                let P = await le(() => Qe(dt, S));
                return P == null ? null : P.toString();
            },
            n = (S) => async (P, E, y) => !!(await le(() => us(S, `${P}/${E}/${y}`))),
            o = async (S, P, E) => {
                e += 1;
                let y = await le(() => Qe(Je, `${S}/${P}/${E}`));
                return y === null ? 'true' : y === void 0 ? '' : y.toString();
            },
            i = (S) => le(() => us(ee, S)),
            a = async (S, P) => {
                let E = `ref/${S}/${P}`,
                    y = await Qe(ee, E);
                if (!y) return null;
                let { fileKey: N = '' } = JSON.parse(y.toString());
                return { prop: P, fileKey: N };
            },
            c = async (S) => le(() => Eu(S)),
            u = async (S) => {
                let P = `metadata/${S}`,
                    E = await Qe(ee, P);
                return E ? JSON.parse(E.toString()) : null;
            },
            l = async (S) => {
                let P = await Qe(ee, `uploads/${S}`);
                if (!P) return null;
                let { fileKey: E = '' } = JSON.parse(P.toString());
                return E;
            },
            f = async (S, P) => {
                let E = await le(() => yu(S, `${P}/`));
                if (!E) return [];
                let y = new Array(E.length);
                for (let N = 0; N < E.length; N++) {
                    let [, V, ve, de] = E[N].split('/');
                    y[N] = [V, ve, de];
                }
                return y;
            },
            g = async (S, P) => {
                let E = await le(() => mu(S, P)),
                    y = new Map();
                for (let N = 0; N < E.length; N++) {
                    let [, , , V] = E[N].split('/');
                    y.set(V, !0);
                }
                return y;
            },
            w = async (S, P) => {
                let E = await le(() => gu(S, P)),
                    y = new Map();
                for (let N = 0; N < E.length; N++) {
                    let [, , , V] = E[N].split('/');
                    y.set(V, !0);
                }
                return y;
            },
            h = async (S) => le(() => hu(S)),
            m = async (S) => {
                let P = le(() => Re(kt, `${S}/`)),
                    E = le(() => Re(It, `${S}/`)),
                    y = le(() => Re(jt, `${S}/`)),
                    N = await P,
                    V = await E,
                    ve = await y,
                    de = new Map();
                for (let J = 0; J < N.length; J++) {
                    let [, B, $e] = N[J].split('/');
                    (B === 'user' || B === 'role') && xe(B, $e, 'read', 'true', de);
                }
                for (let J = 0; J < V.length; J++) {
                    let [, B, $e] = V[J].split('/');
                    (B === 'user' || B === 'role') && xe(B, $e, 'write', 'true', de);
                }
                for (let J = 0; J < ve.length; J++) {
                    let [, B, $e] = ve[J].split('/');
                    (B === 'user' || B === 'role') && xe(B, $e, 'admin', 'true', de);
                }
                return de;
            },
            $ = async (S) => {
                let P = await le(() => Re(yr, `${S}/`));
                return P && P.length > 0;
            },
            _ = () => ({ nodes: t, metadata: e, files: r });
        return {
            getNode: s,
            getRead: n(kt),
            getWrite: n(It),
            getAdmin: n(jt),
            getMetadata: o,
            getFileHead: i,
            getFileRef: a,
            getFileRefs: c,
            getFileMetadata: u,
            getUpload: l,
            getEdges: g,
            getReverseEdges: w,
            getEdgesWildcard: f,
            getNodesWildcard: h,
            listRights: m,
            ownerExists: $,
            getLog: _,
        };
    };
var Ro = () => {
    let t = async (u, l) => (l === null ? Ve(dt, u) : Pe(dt, u, l)),
        e = async (u, l, f, g) => (g ? Pe(Je, `${u}/${l}/${f}`, g) : Ve(Je, `${u}/${l}/${f}`)),
        r = async (u, l, f, g) => (g ? Pe(Gt, `${u}/${l}/${f}`, !0) : Ve(Gt, `${u}/${l}/${f}`)),
        s = (u) => async (l, f, g, w) => {
            let h = `${l}/${f}/${g}`;
            return w ? Pe(u, h, !0) : Ve(u, h);
        },
        n = async (u, l) => {
            if (l === null) throw new Error('Cannot set owner to null');
            return Pe(yr, `${u}/owner/${l}`, !0);
        },
        o = async (u, l, f) => {
            let g = `ref/${u}/${l}`;
            return f === null ? Ve(ee, g) : Pe(ee, g, f);
        },
        i = async (u, l) => (l === null ? Ve(ee, `metadata/${u}`) : Pe(ee, `metadata/${u}`, l)),
        a = async (u, l) => (l === null ? Ve(ee, `uploads/${u}`) : Pe(ee, `uploads/${u}`, { fileKey: l })),
        c = async (u, l, f) => {
            let g = new Date().toISOString(),
                w = `{"userEmail":"${u}","timestamp":"${g}","requestId":"${l}","changeset":${f}}`,
                h = `push/${u}/${g}/${l}`;
            await Pe(Eo, h, w);
        };
    return {
        setNode: t,
        setMetadata: e,
        setReverseEdge: r,
        setRead: s(kt),
        setWrite: s(It),
        setAdmin: s(jt),
        setOwner: n,
        setFileRef: o,
        setFileMetadata: i,
        setUploadId: a,
        setPushLog: c,
    };
};
var Oo = require('@aws-sdk/cloudfront-signer');
var To = async () => {
    let t = await Er(ut, !0),
        e = 1 * 24 * 60 * 60 * 1e3;
    return {
        getUrl: (n, o) => `https://${lt}/${n}?etag=${o}`,
        signUrl: (n, o = e) =>
            (0, Oo.getSignedUrl)({
                url: n,
                keyPairId: Tt || '',
                dateLessThan: new Date(Date.now() + o).toISOString(),
                privateKey: t || '',
            }),
    };
};
var ls = () => {
    let t = new Map(),
        e = new Map(),
        r = new Map(),
        s = new Map(),
        n = new Map(),
        o = 0,
        i = 0,
        a = 0;
    return {
        writeNode: (_, S) => {
            t.set(_, S);
        },
        writeMetadata: (_, S, P, E, y) => {
            hr(S, _, P, E, y, e);
        },
        writeEdgeReverse: (_, S, P, E) => {
            hr(P, E, S, _, 'true', r);
        },
        writeRights: (_, S) => {
            s.set(_, S);
        },
        writePrincipalRight: (_, S, P, E, y) => {
            hr(_, S, P, E, y, s);
        },
        writeInheritRight: (_, S) => {
            pr(_, 'inherit', S, s);
        },
        writeFiles: (_, S, P) => {
            pr(_, S, P, n);
        },
        getGraphJson: () => {
            let _ = new Map();
            if ((t.size > 0 && _.set('nodes', t), e.size > 0 && _.set('edges', e), s.size > 0)) {
                let E = Fe(s);
                _.set('rights', E);
            }
            if ((n.size > 0 && _.set('files', n), r.size > 0)) {
                let E = `{"reverseEdges":${Fe(r)}}`;
                _.set('index', E);
            }
            let S = performance.now(),
                P = Fe(_);
            return (a += performance.now() - S), P;
        },
        getLog: () => ({ timeNode: o, timeMetadata: i, timeJson: a }),
    };
};
var No = () => {
    let t = new Map(),
        e = (E) => t.get(E),
        r = (E, y) => {
            t.set(E, y);
        },
        s = (E) => {
            t.delete(E);
        },
        n = new Map(),
        o = (E) => n.get(E),
        i = (E, y) => {
            n.set(E, y);
        },
        a = (E) => {
            n.delete(E);
        },
        c = new Map(),
        u = (E, y, N) => is(E, y, N, c),
        l = (E, y, N, V) => {
            xe(E, y, N, V, c);
        },
        f = (E, y, N) => {
            let V = gr(E, y, c);
            V?.delete(N);
        },
        g = new Map(),
        w = (E, y, N) => is(E, y, N, g),
        h = (E, y, N, V) => {
            xe(E, y, N, V, g);
        },
        m = (E, y, N) => {
            let V = gr(E, y, g);
            V?.delete(N);
        },
        $ = new Map();
    return {
        nodes: { getNode: e, setNode: r, removeNode: s, getNodePromise: o, setNodePromise: i, removeNodePromise: a },
        metadata: {
            getMetadata: u,
            setMetadata: l,
            removeMetadata: f,
            getMetadataPromise: w,
            removeMetadataPromise: m,
            setMetadataPromise: h,
        },
        urls: {
            getUrl: (E, y) => $.get(`${E}/${y}`),
            setUrl: (E, y, N) => {
                $.set(`${E}/${y}`, N);
            },
            removeUrl: (E, y) => {
                $.delete(`${E}/${y}`);
            },
        },
    };
};
var uc = Uc(cc(), 1);
var lc = async (t, e) => {
    let r;
    try {
        r = oo(e.headers.Authorization || e.headers.authorization || '');
    } catch {
        throw co();
    }
    let s = null;
    try {
        let n = io(e.body || {}, e.body || ''),
            o = new uc.Ajv();
        if ((o.addKeyword('example'), o.validate(t, n))) {
            let a = r.email,
                c = e.headers['x-as-role'] || 'user',
                u = !!e.headers['x-as-admin'] && fo.includes(a);
            return { userEmail: a, body: n, asAdmin: u, asRole: c };
        } else s = be(JSON.stringify(o.errors));
    } catch (n) {
        s = be(n.message);
    }
    throw s;
};
var dc = {
        type: 'object',
        additionalProperties: !1,
        properties: {
            nodes: {
                type: 'object',
                description: 'The nodes hashmap.',
                example: {
                    'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                        id: 'e1d05e83-4122-4fd9-9502-d12e7867b4d6',
                        someProp: 'someVal',
                    },
                },
                additionalProperties: {
                    oneOf: [
                        { type: 'boolean', const: !1, description: '`false` when the node should be deleted.' },
                        {
                            type: 'object',
                            additionalProperties: !0,
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'The id of the node which should be updated.',
                                    example: 'e1d05e83-4122-4fd9-9502-d12e7867b4d6',
                                    minLength: 1,
                                },
                            },
                            required: ['id'],
                        },
                    ],
                },
            },
            edges: {
                type: 'object',
                description: '`fromType`s: A `fromType` hashmap representing all `fromType`s of all present edges.',
                example: {
                    'todo-app': {
                        'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                            'todo-list': { '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' } },
                        },
                    },
                },
                additionalProperties: {
                    type: 'object',
                    description:
                        '`fromId`s: A `from` hashmap representing all `fromId`s of all edges pointing from the given `fromType`.',
                    example: {
                        'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                            'todo-list': { '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' } },
                        },
                    },
                    additionalProperties: {
                        type: 'object',
                        description:
                            '`toType`s: A `toType` hashmap representing all `toType`s of all edges pointing from the given `fromType` and `fromId`.',
                        example: { 'todo-list': { '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' } } },
                        additionalProperties: {
                            type: 'object',
                            description:
                                '`toId`s: A `toId` hashmap representing all `toId`s of all edges pointing from the given `fromType`, `fromId`, `toType` and `toId`.',
                            example: { '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' } },
                            additionalProperties: {
                                oneOf: [
                                    {
                                        type: 'boolean',
                                        description:
                                            '`true` when the edge should be created. `false` when the edge should be deleted.',
                                    },
                                    {
                                        type: 'object',
                                        description:
                                            'Is interpreted as `true` meaning the edge should be created. Object contains additional metadata to be set for the given edge.',
                                        additionalProperties: {
                                            oneOf: [
                                                { type: 'string' },
                                                { type: 'number' },
                                                { type: 'boolean' },
                                                { type: 'null' },
                                                {
                                                    type: 'array',
                                                    items: {
                                                        oneOf: [
                                                            { type: 'string' },
                                                            { type: 'number' },
                                                            { type: 'boolean' },
                                                            { type: 'null' },
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            rights: {
                type: 'object',
                description: '`id`s: A node `id` hashmap representing all nodes which rights should be updated for.',
                example: {
                    'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                        user: { 'test@mail.de': { read: !0, write: !0, admin: !0 } },
                        inherit: { from: '6da76147-c72a-4819-8efe-f4f8e06b6be6' },
                    },
                },
                additionalProperties: {
                    type: 'object',
                    description:
                        'emails: An email hashmap representing all users which rights should be updated for on the given node.',
                    properties: {
                        user: {
                            type: 'object',
                            description: '',
                            example: { 'test@mail.de': { read: !0, write: !0, admin: !0 } },
                            additionalProperties: {
                                type: 'object',
                                description:
                                    'rights: A right hashmap representing all rights which should be updated for the given user on the given node.',
                                example: { read: !0, write: !0, admin: !0 },
                                properties: {
                                    read: {
                                        type: 'boolean',
                                        example: !0,
                                        description: '`true` to allow, `false` to disallow',
                                    },
                                    write: {
                                        type: 'boolean',
                                        example: !0,
                                        description: '`true` to allow, `false` to disallow',
                                    },
                                    admin: {
                                        type: 'boolean',
                                        example: !0,
                                        description: '`true` to allow, `false` to disallow',
                                    },
                                },
                            },
                        },
                        inherit: {
                            type: 'object',
                            description:
                                'Represents right inheritance for the given node from another node denoted in the `from` property. All rights of the given node are deleted and copied from the other node.',
                            example: { from: '6da76147-c72a-4819-8efe-f4f8e06b6be6' },
                            properties: {
                                from: {
                                    type: 'string',
                                    description: 'the node id of the node from which the rights should be copied.',
                                },
                            },
                            required: ['from'],
                        },
                    },
                },
            },
            files: {
                type: 'object',
                description: '`id`s: A node `id` hashmap representing all nodes which files should be uploaded for.',
                example: {
                    'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                        someVideo: {
                            filename: 'my-video.mp4',
                            contentType: 'video/mp4',
                            fileSize: 25e6,
                            partSize: 5242880,
                        },
                        someTextFile: { filename: 'my-file.txt', contentType: 'text/plain', fileSize: 250 },
                    },
                },
                additionalProperties: {
                    type: 'object',
                    description:
                        '`propName`s: A `propName` hashmap representing all properties which files should be attached with on the given node.',
                    example: {
                        someVideo: {
                            filename: 'my-video.mp4',
                            contentType: 'video/mp4',
                            fileSize: 25e6,
                            partSize: 5242880,
                        },
                    },
                    additionalProperties: {
                        oneOf: [
                            { type: 'boolean', const: !1, description: '`false` when the file should be deleted.' },
                            {
                                type: 'object',
                                description: 'File metadata describing the upload to be initialized.',
                                example: {
                                    filename: 'my-video.mp4',
                                    contentType: 'video/mp4',
                                    fileSize: 25e6,
                                    partSize: 5242880,
                                },
                                properties: {
                                    filename: {
                                        type: 'string',
                                        example: 'my-video.mp4',
                                        description:
                                            'The filename as uploaded to the server and presented by the signed URL during download.',
                                        minLength: 1,
                                    },
                                    contentType: {
                                        type: 'string',
                                        example: 'video/mp4',
                                        description: 'Mime type of the file to upload.',
                                        minLength: 1,
                                    },
                                    fileSize: {
                                        type: 'integer',
                                        example: 25e6,
                                        description: 'Size of the file to be uploaded in bytes',
                                        minimum: 1,
                                    },
                                    partSize: {
                                        type: 'integer',
                                        example: 5242880,
                                        default: 5242880,
                                        description: 'Intended part size in bytes in case of a multipart upload.',
                                        minimum: 5242880,
                                    },
                                },
                                required: ['filename', 'contentType', 'fileSize'],
                            },
                        ],
                    },
                },
            },
        },
    },
    fc = async ({ userEmail: t, asAdmin: e, asRole: r, body: s }, n) => {
        let o = await To(),
            i = Ro(),
            [a, c] = await So(s, t, r || 'user', e, {
                dataCache: No(),
                graphAssembler: ls(),
                changelogAssembler: ls(),
                loader: Po(),
                writer: i,
                signer: o,
            });
        return await i.setPushLog(t, n.awsRequestId, c), { statusCode: 200, headers: Ae, body: a };
    },
    Kh = async (t, e) => {
        try {
            let r = await lc(dc, t);
            return await fc(r, e);
        } catch (r) {
            return console.log(r), os(r);
        }
    },
    zh = async ({ body: t }, e) => {
        try {
            return await fc(t, e);
        } catch (r) {
            return os(r);
        }
    };
0 && (module.exports = { handleHttp, handleInvoke, schema });
