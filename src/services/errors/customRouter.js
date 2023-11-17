// Router modified using the logic expressed in this article:
// https://github.com/davidbanham/express-async-errors#how-does-this-work
// all the credits to the author of the article (for the code and the idea).
// I just modified the code to make it work with the modules type import/export in ES6.

import Layer from 'express/lib/router/layer.js';
import { Router as ExpressRouter } from 'express';

const last = (arr = []) => arr[arr.length - 1];
const noop = Function.prototype;

function copyFnProps(oldFn, newFn) {
    Object.keys(oldFn).forEach((key) => {
        newFn[key] = oldFn[key];
    });
    return newFn;
}

function wrap(fn) {
    const newFn = function newFn(...args) {
        const ret = fn.apply(this, args);
        const next = (args.length === 5 ? args[2] : last(args)) || noop;
        if (ret && ret.catch) ret.catch((err) => next(err));
        return ret;
    };
    Object.defineProperty(newFn, 'length', {
        value: fn.length,
        writable: false,
    });
    return copyFnProps(fn, newFn);
}

function patchRouterParam() {
    const originalParam = ExpressRouter.prototype.constructor.param;
    ExpressRouter.prototype.constructor.param = function param(name, fn) {
        fn = wrap(fn);
        return originalParam.call(this, name, fn);
    };
}

Object.defineProperty(Layer.prototype, 'handle', {
    enumerable: true,
    get() {
        return this.__handle;
    },
    set(fn) {
        fn = wrap(fn);
        this.__handle = fn;
    },
});

patchRouterParam();

export const Router = ExpressRouter;
