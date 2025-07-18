#!/usr/bin/env ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var util_1 = require("util");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var redis_1 = require("../lib/redis");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
console.log('Starting sitemap update process...');
/**
 * This script updates all sitemaps to ensure they reflect the latest content.
 * It can be run manually or scheduled as a cron job.
 */
function updateSitemaps() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 7]);
                    console.log('Generating dynamic conversion sitemaps...');
                    return [4 /*yield*/, execAsync('npm run generate-dynamic-sitemaps')];
                case 1:
                    _a.sent();
                    console.log('Generating main sitemap...');
                    return [4 /*yield*/, execAsync('npm run generate-sitemap')];
                case 2:
                    _a.sent();
                    // Update lastmod dates in existing sitemaps
                    return [4 /*yield*/, updateLastModDates()];
                case 3:
                    // Update lastmod dates in existing sitemaps
                    _a.sent();
                    console.log('Sitemap update completed successfully');
                    return [3 /*break*/, 7];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error updating sitemaps:', error_1);
                    return [3 /*break*/, 7];
                case 5: 
                // Close any open connections
                return [4 /*yield*/, (0, redis_1.closeRedisConnection)()];
                case 6:
                    // Close any open connections
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Updates the lastmod dates in existing sitemaps to the current date
 * This ensures search engines know the content has been recently verified
 */
function updateLastModDates() {
    return __awaiter(this, void 0, void 0, function () {
        var today, sitemapFiles, _i, sitemapFiles_1, sitemapFile, content, lastmodRegex;
        return __generator(this, function (_a) {
            today = new Date().toISOString().split('T')[0];
            sitemapFiles = [
                path_1.default.join(process.cwd(), 'public', 'sitemap.xml'),
                path_1.default.join(process.cwd(), 'public', 'sitemaps', 'conversion-sitemaps.xml'),
                path_1.default.join(process.cwd(), 'public', 'sitemaps', 'format-sitemaps.xml')
            ];
            for (_i = 0, sitemapFiles_1 = sitemapFiles; _i < sitemapFiles_1.length; _i++) {
                sitemapFile = sitemapFiles_1[_i];
                if (fs_1.default.existsSync(sitemapFile)) {
                    try {
                        content = fs_1.default.readFileSync(sitemapFile, 'utf8');
                        lastmodRegex = /<lastmod>([^<]+)<\/lastmod>/g;
                        content = content.replace(lastmodRegex, "<lastmod>".concat(today, "</lastmod>"));
                        fs_1.default.writeFileSync(sitemapFile, content);
                        console.log("Updated lastmod dates in ".concat(path_1.default.basename(sitemapFile)));
                    }
                    catch (error) {
                        console.error("Error updating lastmod dates in ".concat(sitemapFile, ":"), error);
                    }
                }
                else {
                    console.warn("Sitemap file not found: ".concat(sitemapFile));
                }
            }
            return [2 /*return*/];
        });
    });
}
// Run the update function
updateSitemaps().catch(function (error) {
    console.error('Unhandled error:', error);
    process.exit(1);
});
