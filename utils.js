"use strict";

/**
 * utils.js — central utility aggregator for ws3-fca.
 *
 * All internal modules that previously required a nested `utils` path
 * (e.g. `../../utils`, `../../../utils`) now resolve here via `./utils`.
 * This file re-exports every helper from constants.js, formatters.js,
 * axios.js, clients.js, and user-agents.js so that callers get a single
 * surface.
 */

const constants = require("./constants");
const formatters = require("./formatters");
const axiosModule = require("./axios");
const clients = require("./clients");
const { randomUserAgent } = require("./user-agents");

module.exports = {
    // --- from constants.js ---
    logOptions: constants.logOptions,
    log: constants.log,
    error: constants.error,
    warn: constants.warn,
    getRandom: constants.getRandom,
    padZeros: constants.padZeros,
    generateThreadingID: constants.generateThreadingID,
    binaryToDecimal: constants.binaryToDecimal,
    generateOfflineThreadingID: constants.generateOfflineThreadingID,
    presenceEncode: constants.presenceEncode,
    presenceDecode: constants.presenceDecode,
    generatePresence: constants.generatePresence,
    generateAccessiblityCookie: constants.generateAccessiblityCookie,
    getGUID: constants.getGUID,
    getFrom: constants.getFrom,
    makeParsable: constants.makeParsable,
    arrToForm: constants.arrToForm,
    arrayToObject: constants.arrayToObject,
    getSignatureID: constants.getSignatureID,
    generateTimestampRelative: constants.generateTimestampRelative,
    getType: constants.getType,
    NUM_TO_MONTH: constants.NUM_TO_MONTH,
    NUM_TO_DAY: constants.NUM_TO_DAY,

    // --- from formatters.js ---
    isReadableStream: formatters.isReadableStream,
    getExtension: formatters.getExtension,
    _formatAttachment: formatters._formatAttachment,
    formatAttachment: formatters.formatAttachment,
    formatDeltaMessage: formatters.formatDeltaMessage,
    formatID: formatters.formatID,
    formatMessage: formatters.formatMessage,
    formatEvent: formatters.formatEvent,
    formatHistoryMessage: formatters.formatHistoryMessage,
    getAdminTextMessageType: formatters.getAdminTextMessageType,
    formatDeltaEvent: formatters.formatDeltaEvent,
    formatTyp: formatters.formatTyp,
    formatDeltaReadReceipt: formatters.formatDeltaReadReceipt,
    formatReadReceipt: formatters.formatReadReceipt,
    formatRead: formatters.formatRead,
    formatDate: formatters.formatDate,
    formatCookie: formatters.formatCookie,
    formatThread: formatters.formatThread,
    formatProxyPresence: formatters.formatProxyPresence,
    formatPresence: formatters.formatPresence,
    decodeClientPayload: formatters.decodeClientPayload,

    // --- from axios.js ---
    cleanGet: axiosModule.cleanGet,
    get: axiosModule.get,
    post: axiosModule.post,
    postFormData: axiosModule.postFormData,
    getJar: axiosModule.getJar,
    setProxy: axiosModule.setProxy,

    // --- from clients.js ---
    parseAndCheckLogin: clients.parseAndCheckLogin,
    saveCookies: clients.saveCookies,
    getAccessFromBusiness: clients.getAccessFromBusiness,
    getAppState: clients.getAppState,

    // --- from user-agents.js ---
    randomUserAgent,

    // makeDefaults needs get/post/postFormData from axios, so we define it here.
    makeDefaults(html, userID, ctx) {
        const { getFrom } = constants;
        const { get, post, postFormData } = axiosModule;
        let reqCounter = 1;
        const revision = getFrom(html, 'revision":', ",");

        function mergeWithDefaults(obj) {
            const newObj = {
                av: userID,
                __user: userID,
                __req: (reqCounter++).toString(36),
                __rev: revision,
                __a: 1,
                ...(ctx && {
                    fb_dtsg: ctx.fb_dtsg,
                    jazoest: ctx.jazoest,
                }),
            };
            if (!obj) return newObj;
            for (const prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (!newObj[prop]) newObj[prop] = obj[prop];
                }
            }
            return newObj;
        }

        return {
            get: (url, jar, qs, ctxx, customHeader = {}) =>
                get(url, jar, mergeWithDefaults(qs), ctx.globalOptions, ctxx || ctx, customHeader),
            post: (url, jar, form, ctxx, customHeader = {}) =>
                post(url, jar, mergeWithDefaults(form), ctx.globalOptions, ctxx || ctx, customHeader),
            postFormData: (url, jar, form, qs, ctxx) =>
                postFormData(url, jar, mergeWithDefaults(form), mergeWithDefaults(qs), ctx.globalOptions, ctxx || ctx),
        };
    },
};
