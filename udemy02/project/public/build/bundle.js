
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/UI/Header.svelte generated by Svelte v3.59.2 */

    const file$8 = "src/UI/Header.svelte";

    function create_fragment$8(ctx) {
    	let header;
    	let h1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "MeetUs";
    			attr_dev(h1, "class", "svelte-1r5k565");
    			add_location(h1, file$8, 4, 4, 33);
    			attr_dev(header, "class", "svelte-1r5k565");
    			add_location(header, file$8, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/UI/Button.svelte generated by Svelte v3.59.2 */

    const file$7 = "src/UI/Button.svelte";

    // (11:0) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (/*mode*/ ctx[2] + " " + /*color*/ ctx[3] + " svelte-9ib8ag"));
    			attr_dev(button, "type", /*type*/ ctx[0]);
    			button.disabled = /*disabled*/ ctx[4];
    			add_location(button, file$7, 11, 4, 220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*mode, color*/ 12 && button_class_value !== (button_class_value = "" + (/*mode*/ ctx[2] + " " + /*color*/ ctx[3] + " svelte-9ib8ag"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*type*/ 1) {
    				attr_dev(button, "type", /*type*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 16) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(11:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if href}
    function create_if_block$3(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[1]);
    			attr_dev(a, "class", "svelte-9ib8ag");
    			add_location(a, file$7, 9, 4, 185);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 2) {
    				attr_dev(a, "href", /*href*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = "button" } = $$props;
    	let { href = null } = $$props;
    	let { mode = null } = $$props;
    	let { color = null } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['type', 'href', 'mode', 'color', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('href' in $$props) $$invalidate(1, href = $$props.href);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, href, mode, color, disabled });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('href' in $$props) $$invalidate(1, href = $$props.href);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, href, mode, color, disabled, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			type: 0,
    			href: 1,
    			mode: 2,
    			color: 3,
    			disabled: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/Badge.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/UI/Badge.svelte";

    function create_fragment$6(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-1iclum");
    			add_location(span, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Badge', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Badge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Badge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Badge",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Meetups/MeetupItem.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/Meetups/MeetupItem.svelte";

    // (22:12) {#if isFavorite}
    function create_if_block$2(ctx) {
    	let badge;
    	let current;

    	badge = new Badge({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(badge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(badge, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(badge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(badge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(badge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(22:12) {#if isFavorite}",
    		ctx
    	});

    	return block;
    }

    // (23:16) <Badge>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FAVORITE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(23:16) <Badge>",
    		ctx
    	});

    	return block;
    }

    // (36:8) <Button href="mailto:{email}">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Contact");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(36:8) <Button href=\\\"mailto:{email}\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:8) <Button             mode="outline"             color={isFavorite ? null : "success"}             type="button"             caption={isFavorite ? "Unfavorite" : "Favorite"}             on:click={() => dispatch("toggleFavorite", id)}         >
    function create_default_slot_1$1(ctx) {
    	let t_value = (/*isFavorite*/ ctx[7] ? "Unfavorite" : "Favorite") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isFavorite*/ 128 && t_value !== (t_value = (/*isFavorite*/ ctx[7] ? "Unfavorite" : "Favorite") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(37:8) <Button             mode=\\\"outline\\\"             color={isFavorite ? null : \\\"success\\\"}             type=\\\"button\\\"             caption={isFavorite ? \\\"Unfavorite\\\" : \\\"Favorite\\\"}             on:click={() => dispatch(\\\"toggleFavorite\\\", id)}         >",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Button type="button">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Show Details");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(46:8) <Button type=\\\"button\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let article;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let p0;
    	let t5;
    	let t6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t7;
    	let div1;
    	let p1;
    	let t8;
    	let t9;
    	let footer;
    	let button0;
    	let t10;
    	let button1;
    	let t11;
    	let button2;
    	let current;
    	let if_block = /*isFavorite*/ ctx[7] && create_if_block$2(ctx);

    	button0 = new Button({
    			props: {
    				href: "mailto:" + /*email*/ ctx[6],
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				mode: "outline",
    				color: /*isFavorite*/ ctx[7] ? null : "success",
    				type: "button",
    				caption: /*isFavorite*/ ctx[7] ? "Unfavorite" : "Favorite",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler*/ ctx[9]);

    	button2 = new Button({
    			props: {
    				type: "button",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(/*subtitle*/ ctx[2]);
    			t4 = space();
    			p0 = element("p");
    			t5 = text(/*address*/ ctx[5]);
    			t6 = space();
    			div0 = element("div");
    			img = element("img");
    			t7 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t8 = text(/*description*/ ctx[4]);
    			t9 = space();
    			footer = element("footer");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			create_component(button1.$$.fragment);
    			t11 = space();
    			create_component(button2.$$.fragment);
    			attr_dev(h1, "class", "svelte-1mo1dn5");
    			add_location(h1, file$5, 19, 8, 433);
    			attr_dev(h2, "class", "svelte-1mo1dn5");
    			add_location(h2, file$5, 25, 8, 567);
    			attr_dev(p0, "class", "svelte-1mo1dn5");
    			add_location(p0, file$5, 26, 8, 595);
    			attr_dev(header, "class", "svelte-1mo1dn5");
    			add_location(header, file$5, 18, 4, 416);
    			if (!src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[1]);
    			attr_dev(img, "class", "svelte-1mo1dn5");
    			add_location(img, file$5, 29, 8, 658);
    			attr_dev(div0, "class", "image svelte-1mo1dn5");
    			add_location(div0, file$5, 28, 4, 630);
    			attr_dev(p1, "class", "svelte-1mo1dn5");
    			add_location(p1, file$5, 32, 8, 738);
    			attr_dev(div1, "class", "content svelte-1mo1dn5");
    			add_location(div1, file$5, 31, 4, 708);
    			attr_dev(footer, "class", "svelte-1mo1dn5");
    			add_location(footer, file$5, 34, 4, 774);
    			attr_dev(article, "class", "svelte-1mo1dn5");
    			add_location(article, file$5, 17, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			if (if_block) if_block.m(h1, null);
    			append_dev(header, t2);
    			append_dev(header, h2);
    			append_dev(h2, t3);
    			append_dev(header, t4);
    			append_dev(header, p0);
    			append_dev(p0, t5);
    			append_dev(article, t6);
    			append_dev(article, div0);
    			append_dev(div0, img);
    			append_dev(article, t7);
    			append_dev(article, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t8);
    			append_dev(article, t9);
    			append_dev(article, footer);
    			mount_component(button0, footer, null);
    			append_dev(footer, t10);
    			mount_component(button1, footer, null);
    			append_dev(footer, t11);
    			mount_component(button2, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (/*isFavorite*/ ctx[7]) {
    				if (if_block) {
    					if (dirty & /*isFavorite*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(h1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*subtitle*/ 4) set_data_dev(t3, /*subtitle*/ ctx[2]);
    			if (!current || dirty & /*address*/ 32) set_data_dev(t5, /*address*/ ctx[5]);

    			if (!current || dirty & /*imageUrl*/ 8 && !src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(img, "alt", /*title*/ ctx[1]);
    			}

    			if (!current || dirty & /*description*/ 16) set_data_dev(t8, /*description*/ ctx[4]);
    			const button0_changes = {};
    			if (dirty & /*email*/ 64) button0_changes.href = "mailto:" + /*email*/ ctx[6];

    			if (dirty & /*$$scope*/ 1024) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty & /*isFavorite*/ 128) button1_changes.color = /*isFavorite*/ ctx[7] ? null : "success";
    			if (dirty & /*isFavorite*/ 128) button1_changes.caption = /*isFavorite*/ ctx[7] ? "Unfavorite" : "Favorite";

    			if (dirty & /*$$scope, isFavorite*/ 1152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MeetupItem', slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { imageUrl } = $$props;
    	let { description } = $$props;
    	let { address } = $$props;
    	let { email } = $$props;
    	let { isFavorite } = $$props;
    	const dispatch = createEventDispatcher();

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<MeetupItem> was created without expected prop 'id'");
    		}

    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<MeetupItem> was created without expected prop 'title'");
    		}

    		if (subtitle === undefined && !('subtitle' in $$props || $$self.$$.bound[$$self.$$.props['subtitle']])) {
    			console.warn("<MeetupItem> was created without expected prop 'subtitle'");
    		}

    		if (imageUrl === undefined && !('imageUrl' in $$props || $$self.$$.bound[$$self.$$.props['imageUrl']])) {
    			console.warn("<MeetupItem> was created without expected prop 'imageUrl'");
    		}

    		if (description === undefined && !('description' in $$props || $$self.$$.bound[$$self.$$.props['description']])) {
    			console.warn("<MeetupItem> was created without expected prop 'description'");
    		}

    		if (address === undefined && !('address' in $$props || $$self.$$.bound[$$self.$$.props['address']])) {
    			console.warn("<MeetupItem> was created without expected prop 'address'");
    		}

    		if (email === undefined && !('email' in $$props || $$self.$$.bound[$$self.$$.props['email']])) {
    			console.warn("<MeetupItem> was created without expected prop 'email'");
    		}

    		if (isFavorite === undefined && !('isFavorite' in $$props || $$self.$$.bound[$$self.$$.props['isFavorite']])) {
    			console.warn("<MeetupItem> was created without expected prop 'isFavorite'");
    		}
    	});

    	const writable_props = [
    		'id',
    		'title',
    		'subtitle',
    		'imageUrl',
    		'description',
    		'address',
    		'email',
    		'isFavorite'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MeetupItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("toggleFavorite", id);

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ('imageUrl' in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ('description' in $$props) $$invalidate(4, description = $$props.description);
    		if ('address' in $$props) $$invalidate(5, address = $$props.address);
    		if ('email' in $$props) $$invalidate(6, email = $$props.email);
    		if ('isFavorite' in $$props) $$invalidate(7, isFavorite = $$props.isFavorite);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		Badge,
    		id,
    		title,
    		subtitle,
    		imageUrl,
    		description,
    		address,
    		email,
    		isFavorite,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ('imageUrl' in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ('description' in $$props) $$invalidate(4, description = $$props.description);
    		if ('address' in $$props) $$invalidate(5, address = $$props.address);
    		if ('email' in $$props) $$invalidate(6, email = $$props.email);
    		if ('isFavorite' in $$props) $$invalidate(7, isFavorite = $$props.isFavorite);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		title,
    		subtitle,
    		imageUrl,
    		description,
    		address,
    		email,
    		isFavorite,
    		dispatch,
    		click_handler
    	];
    }

    class MeetupItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			id: 0,
    			title: 1,
    			subtitle: 2,
    			imageUrl: 3,
    			description: 4,
    			address: 5,
    			email: 6,
    			isFavorite: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetupItem",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get id() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageUrl() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageUrl(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get address() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFavorite() {
    		throw new Error("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFavorite(value) {
    		throw new Error("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Meetups/MeetupGrid.svelte generated by Svelte v3.59.2 */
    const file$4 = "src/Meetups/MeetupGrid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (8:4) {#each meetups as meetup}
    function create_each_block(ctx) {
    	let meetupitem;
    	let current;

    	meetupitem = new MeetupItem({
    			props: {
    				id: /*meetup*/ ctx[2].id,
    				title: /*meetup*/ ctx[2].title,
    				subtitle: /*meetup*/ ctx[2].subtitle,
    				address: /*meetup*/ ctx[2].address,
    				imageUrl: /*meetup*/ ctx[2].imageUrl,
    				description: /*meetup*/ ctx[2].description,
    				email: /*meetup*/ ctx[2].contactEmail,
    				isFavorite: /*meetup*/ ctx[2].isFavorite
    			},
    			$$inline: true
    		});

    	meetupitem.$on("toggleFavorite", /*toggleFavorite_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(meetupitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(meetupitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const meetupitem_changes = {};
    			if (dirty & /*meetups*/ 1) meetupitem_changes.id = /*meetup*/ ctx[2].id;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.title = /*meetup*/ ctx[2].title;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.subtitle = /*meetup*/ ctx[2].subtitle;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.address = /*meetup*/ ctx[2].address;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.imageUrl = /*meetup*/ ctx[2].imageUrl;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.description = /*meetup*/ ctx[2].description;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.email = /*meetup*/ ctx[2].contactEmail;
    			if (dirty & /*meetups*/ 1) meetupitem_changes.isFavorite = /*meetup*/ ctx[2].isFavorite;
    			meetupitem.$set(meetupitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meetupitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meetupitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(meetupitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:4) {#each meetups as meetup}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let current;
    	let each_value = /*meetups*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "id", "meetups");
    			attr_dev(section, "class", "svelte-7iyw6p");
    			add_location(section, file$4, 6, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(section, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*meetups*/ 1) {
    				each_value = /*meetups*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MeetupGrid', slots, []);
    	let { meetups } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (meetups === undefined && !('meetups' in $$props || $$self.$$.bound[$$self.$$.props['meetups']])) {
    			console.warn("<MeetupGrid> was created without expected prop 'meetups'");
    		}
    	});

    	const writable_props = ['meetups'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MeetupGrid> was created with unknown prop '${key}'`);
    	});

    	function toggleFavorite_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('meetups' in $$props) $$invalidate(0, meetups = $$props.meetups);
    	};

    	$$self.$capture_state = () => ({ MeetupItem, meetups });

    	$$self.$inject_state = $$props => {
    		if ('meetups' in $$props) $$invalidate(0, meetups = $$props.meetups);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [meetups, toggleFavorite_handler];
    }

    class MeetupGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { meetups: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetupGrid",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get meetups() {
    		throw new Error("<MeetupGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meetups(value) {
    		throw new Error("<MeetupGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/TextInput.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/UI/TextInput.svelte";

    // (26:4) {:else}
    function create_else_block(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", /*id*/ ctx[1]);
    			input.value = /*value*/ ctx[4];
    			attr_dev(input, "class", "svelte-1k3e3xv");
    			toggle_class(input, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			add_location(input, file$3, 26, 8, 604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler_1*/ ctx[10], false, false, false, false),
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 16 && input.value !== /*value*/ ctx[4]) {
    				prop_dev(input, "value", /*value*/ ctx[4]);
    			}

    			if (dirty & /*valid, touched*/ 320) {
    				toggle_class(input, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(26:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if controlType === "textarea"}
    function create_if_block_1(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "rows", /*rows*/ ctx[3]);
    			attr_dev(textarea, "type", /*type*/ ctx[5]);
    			attr_dev(textarea, "id", /*id*/ ctx[1]);
    			textarea.value = /*value*/ ctx[4];
    			attr_dev(textarea, "class", "svelte-1k3e3xv");
    			toggle_class(textarea, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			add_location(textarea, file$3, 16, 8, 376);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*input_handler*/ ctx[9], false, false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows*/ 8) {
    				attr_dev(textarea, "rows", /*rows*/ ctx[3]);
    			}

    			if (dirty & /*type*/ 32) {
    				attr_dev(textarea, "type", /*type*/ ctx[5]);
    			}

    			if (dirty & /*id*/ 2) {
    				attr_dev(textarea, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 16) {
    				prop_dev(textarea, "value", /*value*/ ctx[4]);
    			}

    			if (dirty & /*valid, touched*/ 320) {
    				toggle_class(textarea, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(16:4) {#if controlType === \\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if validityMessage && !valid && touched}
    function create_if_block$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*validityMessage*/ ctx[7]);
    			attr_dev(p, "class", "error-message svelte-1k3e3xv");
    			add_location(p, file$3, 36, 8, 860);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*validityMessage*/ 128) set_data_dev(t, /*validityMessage*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(36:4) {#if validityMessage && !valid && touched}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let label_1;
    	let t0;
    	let t1;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*controlType*/ ctx[0] === "textarea") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*validityMessage*/ ctx[7] && !/*valid*/ ctx[6] && /*touched*/ ctx[8] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[2]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(label_1, "for", /*id*/ ctx[1]);
    			attr_dev(label_1, "class", "svelte-1k3e3xv");
    			add_location(label_1, file$3, 14, 4, 299);
    			attr_dev(div, "class", "form-control svelte-1k3e3xv");
    			add_location(div, file$3, 13, 0, 268);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label_1);
    			append_dev(label_1, t0);
    			append_dev(div, t1);
    			if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 4) set_data_dev(t0, /*label*/ ctx[2]);

    			if (dirty & /*id*/ 2) {
    				attr_dev(label_1, "for", /*id*/ ctx[1]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			}

    			if (/*validityMessage*/ ctx[7] && !/*valid*/ ctx[6] && /*touched*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextInput', slots, []);
    	let { controlType = null } = $$props;
    	let { id } = $$props;
    	let { label } = $$props;
    	let { rows = null } = $$props;
    	let { value } = $$props;
    	let { type = "text" } = $$props;
    	let { valid = true } = $$props;
    	let { validityMessage = "" } = $$props;
    	let touched = false;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<TextInput> was created without expected prop 'id'");
    		}

    		if (label === undefined && !('label' in $$props || $$self.$$.bound[$$self.$$.props['label']])) {
    			console.warn("<TextInput> was created without expected prop 'label'");
    		}

    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<TextInput> was created without expected prop 'value'");
    		}
    	});

    	const writable_props = [
    		'controlType',
    		'id',
    		'label',
    		'rows',
    		'value',
    		'type',
    		'valid',
    		'validityMessage'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	const blur_handler = () => $$invalidate(8, touched = true);
    	const blur_handler_1 = () => $$invalidate(8, touched = true);

    	$$self.$$set = $$props => {
    		if ('controlType' in $$props) $$invalidate(0, controlType = $$props.controlType);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('rows' in $$props) $$invalidate(3, rows = $$props.rows);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('type' in $$props) $$invalidate(5, type = $$props.type);
    		if ('valid' in $$props) $$invalidate(6, valid = $$props.valid);
    		if ('validityMessage' in $$props) $$invalidate(7, validityMessage = $$props.validityMessage);
    	};

    	$$self.$capture_state = () => ({
    		controlType,
    		id,
    		label,
    		rows,
    		value,
    		type,
    		valid,
    		validityMessage,
    		touched
    	});

    	$$self.$inject_state = $$props => {
    		if ('controlType' in $$props) $$invalidate(0, controlType = $$props.controlType);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('rows' in $$props) $$invalidate(3, rows = $$props.rows);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('type' in $$props) $$invalidate(5, type = $$props.type);
    		if ('valid' in $$props) $$invalidate(6, valid = $$props.valid);
    		if ('validityMessage' in $$props) $$invalidate(7, validityMessage = $$props.validityMessage);
    		if ('touched' in $$props) $$invalidate(8, touched = $$props.touched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		controlType,
    		id,
    		label,
    		rows,
    		value,
    		type,
    		valid,
    		validityMessage,
    		touched,
    		input_handler,
    		input_handler_1,
    		blur_handler,
    		blur_handler_1
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			controlType: 0,
    			id: 1,
    			label: 2,
    			rows: 3,
    			value: 4,
    			type: 5,
    			valid: 6,
    			validityMessage: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get controlType() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlType(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validityMessage() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validityMessage(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/Modal.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/UI/Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    // (22:12) <Button on:click={closeModal}>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(22:12) <Button on:click={closeModal}>",
    		ctx
    	});

    	return block;
    }

    // (21:28)              
    function fallback_block(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*closeModal*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(21:28)              ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let h1;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const footer_slot_template = /*#slots*/ ctx[2].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[3], get_footer_slot_context);
    	const footer_slot_or_fallback = footer_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t3 = space();
    			footer = element("footer");
    			if (footer_slot_or_fallback) footer_slot_or_fallback.c();
    			attr_dev(div0, "class", "modal-backdrop svelte-1rkb22");
    			add_location(div0, file$2, 13, 0, 247);
    			attr_dev(h1, "class", "svelte-1rkb22");
    			add_location(h1, file$2, 15, 4, 324);
    			attr_dev(div1, "class", "content svelte-1rkb22");
    			add_location(div1, file$2, 16, 4, 345);
    			attr_dev(footer, "class", "svelte-1rkb22");
    			add_location(footer, file$2, 19, 4, 399);
    			attr_dev(div2, "class", "modal svelte-1rkb22");
    			add_location(div2, file$2, 14, 0, 300);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, footer);

    			if (footer_slot_or_fallback) {
    				footer_slot_or_fallback.m(footer, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*closeModal*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[3], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(footer_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(footer_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (footer_slot_or_fallback) footer_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default','footer']);
    	let { title } = $$props;
    	const dispatch = createEventDispatcher();

    	function closeModal() {
    		dispatch("cancel");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<Modal> was created without expected prop 'title'");
    		}
    	});

    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		createEventDispatcher,
    		title,
    		dispatch,
    		closeModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, closeModal, slots, $$scope];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isEmpty(value) {
        return value.trim().length == 0;
    }

    function isValidEmail(value) {
        var emailPattern = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
        console.log("emailPattern.test(value)", emailPattern.test(value));
        return emailPattern.test(value);
    }

    /* src/Meetups/EditMeetup.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/Meetups/EditMeetup.svelte";

    // (48:0) <Modal title="Edit Meetup" on:cancel>
    function create_default_slot_2(ctx) {
    	let form;
    	let textinput0;
    	let t0;
    	let textinput1;
    	let t1;
    	let textinput2;
    	let t2;
    	let textinput3;
    	let t3;
    	let textinput4;
    	let t4;
    	let textinput5;
    	let current;
    	let mounted;
    	let dispose;

    	textinput0 = new TextInput({
    			props: {
    				id: "title",
    				label: "Title",
    				valid: /*titleValid*/ ctx[11],
    				validityMessage: "Please enter a valid Title",
    				value: /*title*/ ctx[0]
    			},
    			$$inline: true
    		});

    	textinput0.$on("input", /*input_handler*/ ctx[15]);

    	textinput1 = new TextInput({
    			props: {
    				id: "subtitle",
    				label: "Subtitle",
    				valid: /*subtitleValid*/ ctx[10],
    				validityMessage: "Please enter a valid Subtitle",
    				value: /*subtitle*/ ctx[1]
    			},
    			$$inline: true
    		});

    	textinput1.$on("input", /*input_handler_1*/ ctx[16]);

    	textinput2 = new TextInput({
    			props: {
    				id: "address",
    				label: "Address",
    				valid: /*addressValid*/ ctx[9],
    				validityMessage: "Please enter a valid Address",
    				value: /*address*/ ctx[2]
    			},
    			$$inline: true
    		});

    	textinput2.$on("input", /*input_handler_2*/ ctx[17]);

    	textinput3 = new TextInput({
    			props: {
    				id: "imageUrl",
    				label: "Image URL",
    				valid: /*imageUrlValid*/ ctx[7],
    				validityMessage: "Please enter a valid Image URL",
    				value: /*imageUrl*/ ctx[4]
    			},
    			$$inline: true
    		});

    	textinput3.$on("input", /*input_handler_3*/ ctx[18]);

    	textinput4 = new TextInput({
    			props: {
    				id: "email",
    				label: "Email",
    				valid: /*emailValid*/ ctx[8],
    				validityMessage: "Please enter a valid Email Address",
    				value: /*email*/ ctx[3],
    				type: "email"
    			},
    			$$inline: true
    		});

    	textinput4.$on("input", /*input_handler_4*/ ctx[19]);

    	textinput5 = new TextInput({
    			props: {
    				id: "description",
    				label: "Description",
    				valid: /*descriptionValid*/ ctx[6],
    				validityMessage: "Please enter a valid Description",
    				value: /*description*/ ctx[5],
    				controlType: "textarea"
    			},
    			$$inline: true
    		});

    	textinput5.$on("input", /*input_handler_5*/ ctx[20]);

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(textinput0.$$.fragment);
    			t0 = space();
    			create_component(textinput1.$$.fragment);
    			t1 = space();
    			create_component(textinput2.$$.fragment);
    			t2 = space();
    			create_component(textinput3.$$.fragment);
    			t3 = space();
    			create_component(textinput4.$$.fragment);
    			t4 = space();
    			create_component(textinput5.$$.fragment);
    			attr_dev(form, "class", "svelte-1rfe7ew");
    			add_location(form, file$1, 48, 4, 1274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(textinput0, form, null);
    			append_dev(form, t0);
    			mount_component(textinput1, form, null);
    			append_dev(form, t1);
    			mount_component(textinput2, form, null);
    			append_dev(form, t2);
    			mount_component(textinput3, form, null);
    			append_dev(form, t3);
    			mount_component(textinput4, form, null);
    			append_dev(form, t4);
    			mount_component(textinput5, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submitForm*/ ctx[13]), false, true, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};
    			if (dirty & /*titleValid*/ 2048) textinput0_changes.valid = /*titleValid*/ ctx[11];
    			if (dirty & /*title*/ 1) textinput0_changes.value = /*title*/ ctx[0];
    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};
    			if (dirty & /*subtitleValid*/ 1024) textinput1_changes.valid = /*subtitleValid*/ ctx[10];
    			if (dirty & /*subtitle*/ 2) textinput1_changes.value = /*subtitle*/ ctx[1];
    			textinput1.$set(textinput1_changes);
    			const textinput2_changes = {};
    			if (dirty & /*addressValid*/ 512) textinput2_changes.valid = /*addressValid*/ ctx[9];
    			if (dirty & /*address*/ 4) textinput2_changes.value = /*address*/ ctx[2];
    			textinput2.$set(textinput2_changes);
    			const textinput3_changes = {};
    			if (dirty & /*imageUrlValid*/ 128) textinput3_changes.valid = /*imageUrlValid*/ ctx[7];
    			if (dirty & /*imageUrl*/ 16) textinput3_changes.value = /*imageUrl*/ ctx[4];
    			textinput3.$set(textinput3_changes);
    			const textinput4_changes = {};
    			if (dirty & /*emailValid*/ 256) textinput4_changes.valid = /*emailValid*/ ctx[8];
    			if (dirty & /*email*/ 8) textinput4_changes.value = /*email*/ ctx[3];
    			textinput4.$set(textinput4_changes);
    			const textinput5_changes = {};
    			if (dirty & /*descriptionValid*/ 64) textinput5_changes.valid = /*descriptionValid*/ ctx[6];
    			if (dirty & /*description*/ 32) textinput5_changes.value = /*description*/ ctx[5];
    			textinput5.$set(textinput5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(textinput2.$$.fragment, local);
    			transition_in(textinput3.$$.fragment, local);
    			transition_in(textinput4.$$.fragment, local);
    			transition_in(textinput5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(textinput2.$$.fragment, local);
    			transition_out(textinput3.$$.fragment, local);
    			transition_out(textinput4.$$.fragment, local);
    			transition_out(textinput5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(textinput0);
    			destroy_component(textinput1);
    			destroy_component(textinput2);
    			destroy_component(textinput3);
    			destroy_component(textinput4);
    			destroy_component(textinput5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(48:0) <Modal title=\\\"Edit Meetup\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    // (102:8) <Button type="button" on:click={submitForm} disabled={!formIsValid}             >
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Save");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(102:8) <Button type=\\\"button\\\" on:click={submitForm} disabled={!formIsValid}             >",
    		ctx
    	});

    	return block;
    }

    // (105:8) <Button type="button" mode="outline" on:click={cancel}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(105:8) <Button type=\\\"button\\\" mode=\\\"outline\\\" on:click={cancel}>",
    		ctx
    	});

    	return block;
    }

    // (101:4) 
    function create_footer_slot(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				type: "button",
    				disabled: !/*formIsValid*/ ctx[12],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*submitForm*/ ctx[13]);

    	button1 = new Button({
    			props: {
    				type: "button",
    				mode: "outline",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*cancel*/ ctx[14]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$1, 100, 4, 3025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*formIsValid*/ 4096) button0_changes.disabled = !/*formIsValid*/ ctx[12];

    			if (dirty & /*$$scope*/ 8388608) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8388608) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(101:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Edit Meetup",
    				$$slots: {
    					footer: [create_footer_slot],
    					default: [create_default_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, formIsValid, descriptionValid, description, emailValid, email, imageUrlValid, imageUrl, addressValid, address, subtitleValid, subtitle, titleValid, title*/ 8396799) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let titleValid;
    	let subtitleValid;
    	let addressValid;
    	let emailValid;
    	let imageUrlValid;
    	let descriptionValid;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditMeetup', slots, []);
    	let title = "";
    	let subtitle = "";
    	let address = "";
    	let email = "";
    	let imageUrl = "";
    	let description = "";
    	let formIsValid = false;
    	const dispatch = createEventDispatcher();

    	function submitForm() {
    		dispatch("save", {
    			title,
    			subtitle,
    			address,
    			email,
    			imageUrl,
    			description
    		});
    	}

    	function cancel() {
    		dispatch("cancel");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditMeetup> was created with unknown prop '${key}'`);
    	});

    	const input_handler = event => $$invalidate(0, title = event.target.value);
    	const input_handler_1 = event => $$invalidate(1, subtitle = event.target.value);
    	const input_handler_2 = event => $$invalidate(2, address = event.target.value);
    	const input_handler_3 = event => $$invalidate(4, imageUrl = event.target.value);
    	const input_handler_4 = event => $$invalidate(3, email = event.target.value);
    	const input_handler_5 = event => $$invalidate(5, description = event.target.value);

    	function cancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		TextInput,
    		Button,
    		Modal,
    		isEmpty,
    		isValidEmail,
    		title,
    		subtitle,
    		address,
    		email,
    		imageUrl,
    		description,
    		formIsValid,
    		dispatch,
    		submitForm,
    		cancel,
    		descriptionValid,
    		imageUrlValid,
    		emailValid,
    		addressValid,
    		subtitleValid,
    		titleValid
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ('address' in $$props) $$invalidate(2, address = $$props.address);
    		if ('email' in $$props) $$invalidate(3, email = $$props.email);
    		if ('imageUrl' in $$props) $$invalidate(4, imageUrl = $$props.imageUrl);
    		if ('description' in $$props) $$invalidate(5, description = $$props.description);
    		if ('formIsValid' in $$props) $$invalidate(12, formIsValid = $$props.formIsValid);
    		if ('descriptionValid' in $$props) $$invalidate(6, descriptionValid = $$props.descriptionValid);
    		if ('imageUrlValid' in $$props) $$invalidate(7, imageUrlValid = $$props.imageUrlValid);
    		if ('emailValid' in $$props) $$invalidate(8, emailValid = $$props.emailValid);
    		if ('addressValid' in $$props) $$invalidate(9, addressValid = $$props.addressValid);
    		if ('subtitleValid' in $$props) $$invalidate(10, subtitleValid = $$props.subtitleValid);
    		if ('titleValid' in $$props) $$invalidate(11, titleValid = $$props.titleValid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(11, titleValid = !isEmpty(title));
    		}

    		if ($$self.$$.dirty & /*subtitle*/ 2) {
    			$$invalidate(10, subtitleValid = !isEmpty(subtitle));
    		}

    		if ($$self.$$.dirty & /*address*/ 4) {
    			$$invalidate(9, addressValid = !isEmpty(address));
    		}

    		if ($$self.$$.dirty & /*email*/ 8) {
    			$$invalidate(8, emailValid = isValidEmail(email));
    		}

    		if ($$self.$$.dirty & /*imageUrl*/ 16) {
    			$$invalidate(7, imageUrlValid = !isEmpty(imageUrl));
    		}

    		if ($$self.$$.dirty & /*description*/ 32) {
    			$$invalidate(6, descriptionValid = !isEmpty(description));
    		}

    		if ($$self.$$.dirty & /*titleValid, subtitleValid, addressValid, emailValid, imageUrlValid, descriptionValid*/ 4032) {
    			$$invalidate(12, formIsValid = titleValid && subtitleValid && addressValid && emailValid && imageUrlValid && descriptionValid);
    		}
    	};

    	return [
    		title,
    		subtitle,
    		address,
    		email,
    		imageUrl,
    		description,
    		descriptionValid,
    		imageUrlValid,
    		emailValid,
    		addressValid,
    		subtitleValid,
    		titleValid,
    		formIsValid,
    		submitForm,
    		cancel,
    		input_handler,
    		input_handler_1,
    		input_handler_2,
    		input_handler_3,
    		input_handler_4,
    		input_handler_5,
    		cancel_handler
    	];
    }

    class EditMeetup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditMeetup",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const meetups = writable([
        {
            id: "m1",
            title: "Coding Bootcamp",
            subtitle: "Learn to code in 2 hours",
            description:
                "In this meetup, we will have some experts that teach you how to code!",
            imageUrl:
                "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg",
            address: "27th Nerd Road, 32523 New York",
            contactEmail: "code@test.com",
            isFavorite: false,
        },
        {
            id: "m2",
            title: "Swim Together",
            subtitle: "Let's go for some swimming",
            description: "We will simply swim some rounds!",
            imageUrl:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg/2880px-40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg",
            address: "27th Nerd Road, 32523 New York",
            contactEmail: "swim@test.com",
            isFavorite: false,
        },
    ]);

    const customMeetupsStore = {
        subscribe: meetups.subscribe,
        addMeetup: (meetupData) => {
            const newMeetup = {
                id: Math.random().toString(),
                ...meetupData,
                isFavorite: false,
            };
            meetups.update(items => {
                return [newMeetup, ...items]
            });
        },
        toggleFavorite: (id) => {
            meetups.update(items => {
                // Find the meetup where the meetup id is equal to the id passed in
                const updatedMeetup = { ...items.find((m) => m.id === id) };
                // Now we toggle is "isFavorite" value on the meetup item
                updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
                // Find the index of the updated meetup
                const meetupIndex = items.findIndex((m) => m.id === id);
                // Create a new array with all the meetups
                const updatedMeetups = [...items];
                // Update the meetup at the index with the updated meetup
                updatedMeetups[meetupIndex] = updatedMeetup;
                // Override the existing meetups array
                return updatedMeetups;
            });

        },
    };

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    // (47:4) <Button on:click={() => (editMode = "add")}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("New Meetup");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(47:4) <Button on:click={() => (editMode = \\\"add\\\")}>",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if editMode === "add"}
    function create_if_block(ctx) {
    	let editmeetup;
    	let current;
    	editmeetup = new EditMeetup({ $$inline: true });
    	editmeetup.$on("save", /*addMeetup*/ ctx[2]);
    	editmeetup.$on("cancel", /*cancelEdit*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(editmeetup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editmeetup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editmeetup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editmeetup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editmeetup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(48:4) {#if editMode === \\\"add\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let div;
    	let t1;
    	let button;
    	let t2;
    	let t3;
    	let meetupgrid;
    	let current;
    	header = new Header({ $$inline: true });

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[5]);
    	let if_block = /*editMode*/ ctx[0] === "add" && create_if_block(ctx);

    	meetupgrid = new MeetupGrid({
    			props: { meetups: /*$meetups*/ ctx[1] },
    			$$inline: true
    		});

    	meetupgrid.$on("toggleFavorite", /*toggleFavorite*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			t1 = space();
    			create_component(button.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			create_component(meetupgrid.$$.fragment);
    			attr_dev(div, "class", "meetup-controls svelte-yr8rka");
    			add_location(div, file, 45, 4, 1183);
    			attr_dev(main, "class", "svelte-yr8rka");
    			add_location(main, file, 44, 0, 1172);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t1);
    			mount_component(button, main, null);
    			append_dev(main, t2);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t3);
    			mount_component(meetupgrid, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*editMode*/ ctx[0] === "add") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*editMode*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, t3);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const meetupgrid_changes = {};
    			if (dirty & /*$meetups*/ 2) meetupgrid_changes.meetups = /*$meetups*/ ctx[1];
    			meetupgrid.$set(meetupgrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(meetupgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(meetupgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			if (if_block) if_block.d();
    			destroy_component(meetupgrid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $meetups;
    	validate_store(customMeetupsStore, 'meetups');
    	component_subscribe($$self, customMeetupsStore, $$value => $$invalidate(1, $meetups = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let title = "";
    	let subtitle = "";
    	let imageUrl = "";
    	let address = "";
    	let email = "";
    	let description = "";
    	let editMode;

    	function addMeetup(event) {
    		const meetupData = {
    			title: event.detail.title,
    			subtitle: event.detail.subtitle,
    			imageUrl: event.detail.imageUrl,
    			address: event.detail.address,
    			contactEmail: event.detail.email,
    			description: event.detail.description
    		};

    		// meetups.push(newMeetup); // DOES NOT WORK!
    		customMeetupsStore.addMeetup(meetupData);

    		$$invalidate(0, editMode = null);
    	}

    	function toggleFavorite(event) {
    		customMeetupsStore.toggleFavorite(event.detail);
    	}

    	function cancelEdit() {
    		$$invalidate(0, editMode = null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, editMode = "add");

    	$$self.$capture_state = () => ({
    		Header,
    		MeetupGrid,
    		EditMeetup,
    		TextInput,
    		Button,
    		meetups: customMeetupsStore,
    		MeetupItem,
    		title,
    		subtitle,
    		imageUrl,
    		address,
    		email,
    		description,
    		editMode,
    		addMeetup,
    		toggleFavorite,
    		cancelEdit,
    		$meetups
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) title = $$props.title;
    		if ('subtitle' in $$props) subtitle = $$props.subtitle;
    		if ('imageUrl' in $$props) imageUrl = $$props.imageUrl;
    		if ('address' in $$props) address = $$props.address;
    		if ('email' in $$props) email = $$props.email;
    		if ('description' in $$props) description = $$props.description;
    		if ('editMode' in $$props) $$invalidate(0, editMode = $$props.editMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [editMode, $meetups, addMeetup, toggleFavorite, cancelEdit, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
