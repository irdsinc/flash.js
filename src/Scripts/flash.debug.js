/*!
 * Flash JavaScript Library v1.1.0 (http://flashjs.org)
 * Copyright IRDS, Inc. - http://irdsinc.com
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

; (function (window, document) {
    "use strict";

    var debug = true;

    // Check to make sure jQuery is loaded
    if (typeof jQuery === "undefined") {
        throw new Error("Flash's JavaScript requires jQuery");
    }

    /**
     * Self executing method to verify a valid jQuery version is loaded, otherwise, throw error
     * @param {Object} $ - The jQuery object
     */
    (function ($) {
        var version = $.fn.jquery.split(".");

        if ((version[0] < 2 && version[1] < 11) || (version[0] === 1 && version[1] === 11 && version[2] < 2)) {
            throw new Error("Flash's JavaScript requires jQuery version 1.11.2 or higher");
        }
    })(jQuery);

    (function (factory) {
        // Support three module loading scenarios
        if (typeof window.define === "function" && window.define["amd"]) {
            // [1] AMD anonymous module
            window.define(["exports", "jquery"], factory);
        } else if (typeof window.require === "function" &&
            typeof exports === "object" &&
            typeof window.module === "object") {
            // [2] CommonJS/Node.js
            factory(window.module["exports"] || exports, window.require("jquery") || jQuery);
        } else {
            // [3] No module loader (plain <script> tag) - put directly in global namespace
            factory(window["flash"] = {}, jQuery);
        }
    }(function (flashExports, $) {
        var flash = flashExports || {},

        // #region Private

        // #region Objects

        // #region application

            application = {
                activeTab: null,
                resources: {
                    errorMessages: {
                        DEFAULT: "An unknown error occured. Please go back and try again.",
                        FORBIDDEN: "You do not have permission to view this directory or page.",
                        NOTFOUND: "The page cannot be found.",
                        UNAUTHORIZED: "Your session has expired. Please <a href=\"{0}\" class=\"alert-link\">Sign In</a> to continue."
                    }
                },
                settings: {
                    afterLoad: function () { },
                    afterUnload: function () { },
                    alertModalTargetElementSelector: ".modal-body",
                    alertPageTargetElementSelector: "body > #content > .container",
                    anchorExclusionRoutingSelector: "[href^='http'],\
                        [href^='https'],\
                        [href^='tel'],\
                        [href^='mailto'],\
                        [href^='#'],\
                        [target='_blank'],\
                        .disable-flash-routing",
                    appendTemplateRequestedPath: false,
                    appendTemplateRequestedPathParamterName: "path",
                    baseRootPath: "/",
                    beforeLoad: function () { },
                    beforeUnload: function () { },
                    buttonLoadingClassName: "btn-loading",
                    buttonLoadingDisabledClassName: "btn-loading-disabled",
                    caseSensitiveRoutes: false,
                    disableScrollToForAlerts: false,
                    disableSpanInLabelDefaultAction: true,
                    disabledButtonSelector: "button[disabled=disabled],\
                        input[type=submit][disabled=disabled],\
                        input[type=button][disabled=disabled],\
                        input[type=reset][disabled=disabled],\
                        a.btn[disabled=disabled]",
                    dismissibleAlerts: false,
                    documentParentElementSelector: "html, body",
                    documentTitleFormats: {
                        main: "{title} - {tagline}",
                        content: "{pageTitle} | {title}"
                    },
                    errorPath: {
                        defaultPath: "error",
                        400: "error/bad-request",
                        401: "error/unauthorized",
                        403: "error/forbidden",
                        404: "error/not-found"
                    },
                    googleAnalyticsTrackingCode: null,
                    messagePath: "message",
                    mobilePositionFixedElementSelector: null,
                    modalParentElementSelector: ".modal",
                    modalHiddenEventName: "hidden.bs.modal",
                    modalHideEventName: "hide.bs.modal",
                    modalShowEventName: "show.bs.modal",
                    modalShownEventName: "shown.bs.modal",
                    pageLoadingClassName: "page-loading",
                    showButtonLoading: true,
                    showPageLoading: true,
                    staticHeaderHeight: null,
                    templateContainerElementSelector: "#content",
                    unauthroizedAutoRedirect: false,
                    unauthorizedRedirectPath: "sign-in"
                },
                statusMessage: null,
                title: null
            },

        // #endregion application

        // #endregion Objects

        // #region Methods

        // #region log

        /**
         * Private self executing function containing the logging functions
         */
        log = (function () {
            var self = {};

            // Check to ensure console does not throw errors during logging if it is not defined
            if (typeof console === "undefined") {
                window.console = {
                    error: function () { },
                    info: function () { },
                    log: function () { },
                    warn: function () { }
                };
            }

            // #region Private

            // #region Methods

            // #region buildMessage

            /**
             * Concatinate the log message using the type, message and location of the calling function
             * @param {String} type - The type of message to log
             * @param {String} message - The message to log
             * @param {String} location - The namespace location of the calling function
             * @returns {String} The concatinated log message to log to the console
             */
            function buildMessage(type, message, location) {
                return type + ": " + (location ? "at " + location + " - " : "") + message;
            }

            // #endregion buildMessage

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Methods

            // #region default

            /**
             * Log the message to the console
             * @param {(Object|String)} obj
             */
            self.default = function (obj) {
                // Log only if in debug mode
                if (debug) {
                    console.log(obj);
                }
            };

            // #endregion default

            // #region depreciated

            /**
             * Log the depreciated type message
             * @param {String} message - The message to log
             * @param {String} location - The namespace location of the calling function
             */
            self.depreciated = function (message, location) {
                // Log only if in debug mode
                if (debug) {
                    var builtMessage = buildMessage("DEPRECIATED", message, location);

                    console.log(builtMessage);
                }
            };

            // #endregion depreciated

            // #region error

            /**
             * Log the error type message
             * @param {String} message - The message to log
             * @param {String} location - The namespace location of the calling function
             */
            self.error = function (message, location) {
                // Log only if in debug mode
                if (debug) {
                    var builtMessage = buildMessage("ERROR", message, location);

                    console.error(builtMessage);
                }
            };

            // #endregion error

            // #region info

            /**
             * Log the info type message
             * @param {String} message - The message to log
             * @param {String} location - The namespace location of the calling function
             */
            self.info = function (message, location) {
                // Log only if in debug mode
                if (debug) {
                    var builtMessage = buildMessage("INFO", message, location);

                    console.info(builtMessage);
                }
            };

            // #endregion info

            // #region warning

            /**
             * Log the warning type message
             * @param {String} message - The message to log
             * @param {String} location - The namespace location of the calling function
             */
            self.warning = function (message, location) {
                // Log only if in debug mode
                if (debug) {
                    var builtMessage = buildMessage("WARNING", message, location);

                    console.warn(builtMessage);
                }
            }

            // #endregion warning

            // #endregion Methods

            // #endregion Public

            return self;
        })(),

        // #endregion log

        // #region object

        /**
         * Private self executing function containing the object constructors and helper functions
         */
        object = (function () {
            var self = {};

            // #region Private

            // #region Methods

            // #region buildObjectName

            /**
             * Concatinate the object name using the prefix and suffix
             * @param {String} prefix - The prefix of the object name
             * @param {String} suffix - The suffix of the object name
             * @returns {String} The concatinated object name
             */
            function buildObjectName(prefix, suffix) {
                return prefix ? prefix + (suffix || "") : null;
            }

            // #endregion buildObjectName

            // #region buildControllerName

            /**
             * Concatinate the controller object name
             * @param {String} prefix - The prefix of the object name
             * @returns {String} The concatinated object name
             */
            function buildControllerName(prefix) {
                return buildObjectName(prefix, "Controller");
            }

            // #endregion buildControllerName

            // #region buildTabName

            /**
             * Concatinate the tab object name
             * @param {String} prefix - The prefix of the object name
             * @returns {String} The concatinated object name
             */
            function buildTabName(prefix) {
                return buildObjectName(prefix, "Tab");
            }

            // #endregion buildTabName

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Constructors

            // #region StatusMessage

            /**
             * The StatusMessage object constructor
             * @param {String} type - The type of the alert
             * @param {String} message - The message to display in the alert
             * @param {String} description - The detailed description of the alert
             */
            self.StatusMessage = function (type, message, description) {
                this.type = type;
                this.message = message;
                this.description = description;
            };

            // #endregion StatusMessage

            // #region Template

            /**
             * The Template object constructor
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} containerElementSelector - The container element selector used to prepend the template to
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} title - The template title used for the document title
             *      @param {Number} type - The template type
             */
            self.Template = function (config) {
                this.callback = config.callback;
                this.containerElementSelector = config.containerElementSelector;
                this.controller = buildControllerName(config.controller || config.prefix);
                this.hash = config.hash;
                this.html = null;
                this.tab = buildTabName(config.prefix);
                this.title = buildObjectName(config.title);
                this.type = config.type;
            };

            // #endregion Template

            // #endregion Constructors

            // #endregion Public

            return self;
        })(),

        // #endregion object

        // #region hashchange

        /**
         * Private self executing function containing the hashchange functions
         */
        hashchange = (function () {
            var self = {};

            // #region Public

            // #region Methods

            // #region bind

            /**
             * Bind to the hashchange event
             * @param {Function} method - A function to execute when the hashchange event fires
             */
            self.bind = function (method) {
                if (flash.utils.object.isFunction(method)) {
                    $(window).off("hashchange.flash").on("hashchange.flash", method);
                }
            };

            // #endregion bind

            // #endregion Methods

            // #endregion Public

            return self;
        })(),

        // #endregion hashchange

        // #region popstate

        /**
         * Private self executing function containing the popstate functions
         */
        popstate = (function () {
            var self = {};

            // #region Public

            // #region Methods

            // #region bind

            /**
             * Bind to the popstate event
             */
            self.bind = function (method) {
                if (flash.utils.object.isFunction(method)) {
                    $(window).off("popstate.flash").on("popstate.flash", method);
                }
            };

            // #endregion bind

            // #endregion Methods

            // #endregion Public

            return self;
        })(),

        // #endregion popstate

        // #region templating

        /**
         * Private self executing function containing the templating functions
         */
        templating = (function () {
            var self = {},

            // #region Private

            // #region Objects

            // #region activeClassName

                activeClassName = "active",

            // #endregion activeClassName

            // #region clearRequested

                clearRequested = false,

            // #endregion clearRequested

            // #region loadedResources

                loadedResources = [],

            // #endregion loadedResources

            // #region responseStatuses

                responseStatuses = { ERROR: "Error", SUCCESS: "Success", WARNING: "Warning" },

            // #endregion responseStatuses

            // #region templates

                templates = [];

            // #endregion templates

            // #endregion Objects

            // #region Methods

            // #region convertHtmlStringToJqueryObject

            /**
             * Convert an HTML string into a jQuery object
             * @param {String} obj - The HTML string
             * @returns {Object} A jQuery object
             */
            function convertHtmlStringToJqueryObject(obj) {
                return $("<div/>").html(obj);
            }

            // #endregion convertHtmlStringToJqueryObject

            // #region runAfterLoad

            /**
             * Additional template manipulation after template has been loaded
             * @param {Number} type - The template type
             * @param {Object} params - The object containing the parameters
             * @param {Function} pageCallback - The function containing addtional steps for after loading template has completed
             */
            function runAfterLoad(type, params, pageCallback) {
                var afterLoad = application.settings.afterLoad;

                if (flash.utils.object.isFunction(afterLoad)) {
                    afterLoad(type, params);
                }

                // Send google analytics page view data
                tracking.sendGoogleAnalyticsPageView();

                // Enable all disabled buttons in the current template
                flash.$parentElement.find(application.settings.disabledButtonSelector).attr("disabled", false);

                routing.listener();

                var anchorExclusionRoutingSelector = application.settings.anchorExclusionRoutingSelector;

                if (!flash.utils.object.isString(anchorExclusionRoutingSelector)) {
                    log.error(
                        "application.settings.anchorExclusionRoutingSelector is not properly set.",
                        "templating.runAfterLoad");

                    return;
                }

                var anchorSelector = "a.btn:not(" + anchorExclusionRoutingSelector + ")";

                // Bind click event to any link buttons to allow for toggling and loading animation
                flash.$parentElement.find(anchorSelector).each(function () {
                    $(this).click(function () {
                        var $button = $(this);

                        flash.utils.toggleButton($button);
                    });
                });

                var mobilePositionFixedElementSelector = application.settings.mobilePositionFixedElementSelector;

                // Check if user supplied position fixed elements for mobile
                if (flash.utils.object.isString(mobilePositionFixedElementSelector)) {
                    // On focus and blur for form elements, update position for fixed elements as virtual keyboard causes
                    // issues
                    $(document).off(".flashMobile").on("focus.flashMobile", "input, textarea, select", function () {
                        if (flash.utils.isBrowserMobile()) {
                            $(mobilePositionFixedElementSelector).css("position", "absolute");
                        }
                    }).on("blur.flashMobile", "input, textarea, select", function () {
                        if (flash.utils.isBrowserMobile()) {
                            $(mobilePositionFixedElementSelector).css("position", "");
                        }
                    });
                }

                var disableSpanInLabelDefaultAction = application.settings.disableSpanInLabelDefaultAction;

                // Bind click event to labels containing span elements to disable default selection of checkbox, if
                // checkbox is present
                if (flash.utils.object.isBoolean(disableSpanInLabelDefaultAction) && disableSpanInLabelDefaultAction === true) {
                    flash.$parentElement.find("label").has("span").each(function () {
                        $(this).click(function (e) {
                            if (e.target.nodeName === "SPAN") {
                                e.preventDefault();
                            }
                        });
                    });
                }

                if (flash.utils.object.isFunction(pageCallback)) {
                    pageCallback();
                }

                if (type !== self.types.PARTIAL) {
                    self.hidePageLoading();
                }
            }

            // #endregion runAfterLoad

            // #region runAfterUnload

            /**
             * Additional template manipulation after template has been unloaded
             * @param {Number} type - The template type
             * @param {Object} params - The object containing the parameters
             */
            function runAfterUnload(type, params) {
                if (type === self.types.PAGE) {
                    // Hide mobile nav after page unload
                    var $nav = $(".navbar-collapse");

                    if ($nav.hasClass("in")) {
                        $(".navbar-collapse").collapse("hide");
                    }
                }

                var afterUnload = application.settings.afterUnload;

                if (flash.utils.object.isFunction(afterUnload)) {
                    afterUnload(type, params);
                }
            }

            // #endregion runAfterUnload

            // #region display

            /**
             * Inject the template into the DOM and scroll to the container element
             * @param {Object} template - The template object
             * @param {String} preparedHtml - The HTML string of the template to load
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function containing addtional steps for loading template
             * @param {Function} pageCallback - The function containing addtional steps for after loading template has completed
             */
            function display(template, preparedHtml, params, callback, pageCallback) {
                var beforeLoad = application.settings.beforeLoad;

                if (flash.utils.object.isFunction(beforeLoad)) {
                    beforeLoad(template.type, preparedHtml, params);
                }

                var $templateContainerElement = $(template.containerElementSelector);

                // Set the view to the prepared HTML string
                $templateContainerElement.html(preparedHtml);

                if (flash.utils.object.isFunction(callback)) {
                    callback();
                }

                var documentParentElementSelector = application.settings.documentParentElementSelector,
                    $parentElement =
                        template.type === self.types.PAGE && flash.utils.object.isString(documentParentElementSelector)
                            ? $(documentParentElementSelector)
                            : flash.$parentElement;

                flash.utils.scrollTo($parentElement, $templateContainerElement);

                if (flash.utils.object.isFunction(template.callback)) {
                    template.callback(true);
                }

                runAfterLoad(template.type, params, pageCallback);
            }

            // #endregion display

            // #region displayModal

            /**
             * Inject the modal template into the DOM and bind shown/hidden modal events
             * @param {Object} template - The template object
             * @param {String} preparedHtml - The HTML string of the template to load
             * @param {Object} params - The object containing the parameters
             * @param {Function} pageCallback - The function containing addtional steps for after loading template has completed
             */
            function displayModal(template, preparedHtml, params, pageCallback) {
                var $modal = $(preparedHtml);

                // Hide the modal when an unbind event fires
                $(document).off("unloaded.flash.route").on("unloaded.flash.route", function () {
                    $modal.modal("hide");

                    // When modal lives inside #content container, modal elements are not properly updated on hide event,
                    // due to missing reference when HTML is replaced inside #content container
                    $("body").removeClass("modal-open");
                    $(".modal-backdrop").remove();
                });

                var modalShowEventName = application.settings.modalShowEventName,
                    modalShownEventName = application.settings.modalShownEventName,
                    modalHideEventName = application.settings.modalHideEventName,
                    modalHiddenEventName = application.settings.modalHiddenEventName;

                if (!flash.utils.object.isString(modalShowEventName)) {
                    log.error("application.settings.modalShowEventName is not properly set.", "templating.displayModal");

                    return;
                }

                if (!flash.utils.object.isString(modalShownEventName)) {
                    log.error("application.settings.modalShownEventName is not properly set.", "templating.displayModal");

                    return;
                }

                if (!flash.utils.object.isString(modalHideEventName)) {
                    log.error("application.settings.modalHideEventName is not properly set.", "templating.displayModal");

                    return;
                }

                if (!flash.utils.object.isString(modalHiddenEventName)) {
                    log.error(
                        "application.settings.modalHiddenEventName is not properly set.",
                        "templating.displayModal");

                    return;
                }

                $modal.on(modalShowEventName, function () {
                    var beforeLoad = application.settings.beforeLoad;

                    if (flash.utils.object.isFunction(beforeLoad)) {
                        beforeLoad(template.type, preparedHtml, params);
                    }
                });

                $modal.on(modalShownEventName, function () {
                    if (flash.utils.object.isFunction(template.callback)) {
                        template.callback(true);
                    }

                    runAfterLoad(template.type, params, pageCallback);

                    // TODO: not sure if this is still required, need to check
                    //$(".modal-dialog").resize(function () { });
                });

                $modal.on(modalHideEventName, function () {
                    self.hidePageLoading();

                    var beforeUnload = application.settings.beforeUnload;

                    if (flash.utils.object.isFunction(beforeUnload)) {
                        beforeUnload(template.type, params);
                    }
                });

                $modal.on(modalHiddenEventName, function () {
                    if (flash.utils.object.isFunction(template.callback)) {
                        template.callback(false);
                    }

                    if (template.controller &&
                        window[template.controller] &&
                        flash.utils.object.isFunction(window[template.controller].unload)) {
                        window[template.controller].unload(params);
                    }

                    runAfterUnload(template.type, params);

                    // Unbind the show/shown/hide/hidden events from the modal
                    $modal
                        .off(modalShowEventName)
                        .off(modalShownEventName)
                        .off(modalHideEventName)
                        .off(modalHiddenEventName);

                    // Remove the modal from the DOM
                    $modal.remove();
                });

                $modal.modal();
            }

            // #endregion displayModal

            // #region get

            /**
             * Try to find the template in the client browser session
             * @param {String} hash - The unique identifier of the template
             * @returns {Object} The template object 
             */
            function get(hash) {
                for (var i = 0; i < templates.length; i++) {
                    if (hash === templates[i].hash) {
                        return templates[i];
                    }
                }

                return null;
            }

            // #endregion get

            // #region isResourceLoaded

            /**
             * Check whether the supplied source path has been loaded
             * @param {String} src - The unqiue source path of the resource to check
             * @returns {Boolean} Is the resource loaded at the supplied source
             */
            function isResourceLoaded(src) {
                return $.inArray(src, loadedResources) >= 0;
            }

            // #endregion isResourceLoaded

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Objects

            // #region types

            self.types = { PAGE: 0, MODAL: 1, PARTIAL: 2 };

            // #endregion types

            // #endregion Objects

            // #region Methods

            // #region addLinkTag

            /**
             * Add/update a link tag
             * @param {Object} attr - The link tag attributes
             */
            self.addLinkTag = function (attr) {
                self.removeLinkTag(attr);

                // Create and add the new link tag
                var $linkTag = $("<link/>").attr(attr);

                $("title").before($linkTag);
            };

            // #endregion addLinkTag

            // #region addMetaTag

            /**
             * Add/update a meta tag
             * @param {Object} attr - The meta tag attributes
             */
            self.addMetaTag = function (attr) {
                self.removeMetaTag(attr);

                // Create and add the new meta tag
                var $metaTag = $("<meta/>").attr(attr);

                $("title").before($metaTag);
            };

            // #endregion addMetaTag

            // #region clear

            /**
             * Clear the client browser session templates
             */
            self.clear = function () {
                clearRequested = true;
            };

            // #endregion clear

            // #region displayPageLoading

            /**
             * Display the page loading element on the view
             */
            self.displayPageLoading = function () {
                var showPageLoading = application.settings.showPageLoading;

                // Check to make sure page loading is active
                if (!flash.utils.object.isBoolean(showPageLoading) || showPageLoading !== true) {
                    return;
                }

                var pageLoadingClassName = application.settings.pageLoadingClassName;

                if (!flash.utils.object.isString(pageLoadingClassName)) {
                    log.error(
                        "application.settings.pageLoadingClassName is not properly set.",
                        "templating.displayPageLoading");

                    return;
                }

                var $pageLoading = $("." + pageLoadingClassName);

                $pageLoading.trigger("show.pageLoading.flash.template");

                if ($pageLoading.length) {
                    $pageLoading.show();

                    $pageLoading.trigger("shown.pageLoading.flash.template");

                    return;
                }

                var $body = $("body"),
                    $div = $("<div/>", {
                        "class": pageLoadingClassName
                    });

                $("<span/>").text("Loading...").appendTo($div);

                // Add the page loading element to the body element
                $body.prepend($div);

                $pageLoading.trigger("shown.pageLoading.flash.template");
            };

            // #endregion displayPageLoading

            // #region hidePageLoading

            /**
             * Hide the page loading element from the view
             */
            self.hidePageLoading = function () {
                var showPageLoading = application.settings.showPageLoading;

                // Check to make sure page loading is active
                if (!flash.utils.object.isBoolean(showPageLoading) || showPageLoading !== true) {
                    return;
                }

                var pageLoadingClassName = application.settings.pageLoadingClassName;

                if (!flash.utils.object.isString(pageLoadingClassName)) {
                    log.error(
                        "application.settings.pageLoadingClassName is not properly set.",
                        "templating.hidePageLoading");

                    return;
                }

                var $pageLoading = $("." + pageLoadingClassName);

                $pageLoading.trigger("hide.pageLoading.flash.template");

                // Hide the page loading element if it exists
                if ($pageLoading.length) {
                    $pageLoading.hide();
                }

                $pageLoading.trigger("hidden.pageLoading.flash.template");
            };

            // #endregion hidePageLoading

            // #region load

            /**
             * Load the template for the supplied hash from client browser session or request new template
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} containerElementSelector - The container element selector used to prepend the template to
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} title - The template title used for the document title
             *      @param {Number} type - The template type
             *      @param {String} url - The url of the view (html) to load
             */
            self.load = function (config) {
                if (!flash.utils.object.isObject(config)) {
                    log.error("config is not set.", "templating.load");

                    return;
                }

                if (!flash.utils.object.isNumber(config.type)) {
                    log.error("config.type is not set.", "templating.load");

                    return;
                }

                if (!flash.utils.object.isString(config.hash)) {
                    log.error("config.hash is not set.", "templating.load");

                    return;
                }

                if (!flash.utils.object.isString(config.url)) {
                    log.error("config.url is not set.", "templating.load");

                    return;
                }

                if (!flash.utils.object.isString(config.containerElementSelector) &&
                    (config.type === self.types.PAGE || config.type === self.types.PARTIAL)) {
                    log.error("config.containerElementSelector is not set.", "templating.load");

                    return;
                }

                log.info(config.hash, "templating.load");

                var template = get(config.hash);

                if (template) {
                    template.init(config.params);
                } else {
                    log.info("new " + config.hash, "templating.load");

                    template = new object.Template(config);

                    var url = config.url,
                        appendTemplateRequestedPath = application.settings.appendTemplateRequestedPath,
                        appendTemplateRequestedPathParamterName =
                            application.settings.appendTemplateRequestedPathParamterName;

                    if (flash.utils.object.isBoolean(appendTemplateRequestedPath) &&
                        appendTemplateRequestedPath === true) {
                        url = flash.utils.addUpdateQueryStringParam(url,
                            appendTemplateRequestedPathParamterName,
                            encodeURIComponent(flash.route.currentPath));
                    }

                    template.request(url, config.params);
                }
            };

            // #endregion load

            // #region loadModal

            /**
             * Load the modal template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadModal = function (hash, url, prefix, params, callback) {
                self.displayPageLoading();

                var config = flash.utils.object.isObject(arguments[0]) ? arguments[0] : {
                    callback: callback,
                    hash: hash,
                    params: params,
                    prefix: prefix,
                    url: url
                };

                config.type = self.types.MODAL;

                self.load(config);
            };

            // #endregion loadModal

            // #region loadPage

            /**
             * Load the page template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The template title used for the document title
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} title - The template title used for the document title
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadPage = function (hash, url, title, prefix, params, callback) {
                var templateContainerElementSelector = application.settings.templateContainerElementSelector;

                if (!flash.utils.object.isString(templateContainerElementSelector)) {
                    log.error(
                        "application.settings.templateContainerElementSelector is not properly set.",
                        "templating.loadPage");

                    return;
                }

                var config = flash.utils.object.isObject(arguments[0]) ? arguments[0] : {
                    callback: callback,
                    hash: hash,
                    params: params,
                    prefix: prefix,
                    title: title,
                    url: url
                };

                config.containerElementSelector = templateContainerElementSelector;
                config.type = self.types.PAGE;
                
                self.load(config);
            };

            // #endregion loadPage

            // #region loadPartial

            /**
             * Load the partial templatetemplate
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} containerElementSelector - The container element selector used to prepend the template to
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} containerElementSelector - The container element selector used to prepend the template to
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadPartial = function (hash, url, containerElementSelector, callback) {
                var config = flash.utils.object.isObject(arguments[0]) ? arguments[0] : {
                    callback: callback,
                    containerElementSelector: containerElementSelector,
                    hash: hash,
                    url: url
                };

                config.type = self.types.PARTIAL;

                self.load(config);
            };

            // #endregion loadPartial

            // #region removeLinkTag

            /**
             * Remove a link tag
             * @param {Object} attr - The link tag attributes
             */
            self.removeLinkTag = function (attr) {
                // Check if the link tag exists using the rel
                var $currentLinkTag = $("link[rel='" + attr.rel + "']");

                // Remove the link before adding a new one
                if ($currentLinkTag && $currentLinkTag.length > 0) {
                    $currentLinkTag.remove();
                }
            };

            // #endregion removeLinkTag

            // #region removeMetaTag

            /**
             * Remove a meta tag
             * @param {Object} attr - The meta tag attributes
             */
            self.removeMetaTag = function (attr) {
                var $currentMetaTag;

                // Check if the meta tag exists using the name/property
                if (attr.name) {
                    $currentMetaTag = $("meta[name='" + attr.name + "']");
                }
                else if (attr.property) {
                    $currentMetaTag = $("meta[property='" + attr.property + "']");
                }

                // Remove the meta tag before adding a new one
                if ($currentMetaTag !== undefined && $currentMetaTag && $currentMetaTag.length > 0) {
                    $currentMetaTag.remove();
                }
            };

            // #endregion removeMetaTag

            // #region setActiveTab

            /**
             * Set the application active tab and update the view with the active tab
             * @param {String} tab - The active tab object name
             */
            self.setActiveTab = function (tab) {
                application.activeTab = tab;

                $("[tab-name]").removeClass(activeClassName);
                $("[tab-name*='" + tab + "']").addClass(activeClassName);
            };

            // #endregion setActiveTab

            // #region setDocumentTitle

            /**
             * Set the document title
             * @param {string} pageTitle - The title of the template page that has been loaded
             */
            self.setDocumentTitle = function (pageTitle) {
                var title,
                    documentTitleFormats = application.settings.documentTitleFormats;

                if (!flash.utils.object.isObject(documentTitleFormats)) {
                    log.error(
                        "application.settings.documentTitleFormats is not properly set.",
                        "templating.setDocumentTitle");

                    return;
                }

                if (pageTitle && flash.utils.object.isString(pageTitle)) {
                    if ((!application.title || application.title === "") &&
                        (!application.title.tagline || application.title.tagline === "") &&
                        (!application.title.name || application.title.name === "")) {
                        title = pageTitle;
                    } else {
                        if (!flash.utils.object.isString(documentTitleFormats.content)) {
                            log.error(
                                "application.settings.documentTitleFormats.content is not properly set.",
                                "templating.setDocumentTitle");

                            return;
                        }

                        title = documentTitleFormats.content.replace("{pageTitle}", pageTitle);

                        if (flash.utils.object.isString(application.title)) {
                            title = title.replace("{title}", application.title);
                        } else {
                            title = title
                                .replace("{title}", application.title.name)
                                .replace("{tagline}", application.title.tagline);
                        }
                    }
                } else {
                    if (!application.title || flash.utils.object.isString(application.title)) {
                        title = application.title || "";
                    } else {
                        if (!application.title.tagline || application.title.tagline === "") {
                            title = application.title.name || "";
                        } else if (!application.title.name || application.title.name === "") {
                            title = application.title.tagline || "";
                        } else {
                            if (!flash.utils.object.isString(documentTitleFormats.main)) {
                                log.error(
                                    "application.settings.documentTitleFormats.main is not properly set.",
                                    "templating.setDocumentTitle");

                                return;
                            }

                            title = documentTitleFormats.main
                                .replace("{title}", application.title.name)
                                .replace("{tagline}", application.title.tagline);
                        }
                    }
                }

                document.title = title;
            };

            // #endregion setDocumentTitle

            // #region unload

            /**
             * Run clean up right before and/or after the template has been unloaded
             * @param {String} hash - The unique identifier of the template
             * @param {Object} params - The object containing the parameters
             */
            self.unload = function (hash, params) {
                var template = get(hash);

                // Clear templates if a clear was requested
                if (clearRequested) {
                    templates = [];

                    clearRequested = false;
                }

                // Ensure we have a template object
                if (!template) {
                    log.warning(
                        "Template was not found for route hash '" + hash + "', therefore, unload was skipped.",
                        "templating.unload");

                    return;
                }

                self.displayPageLoading();

                var beforeUnload = application.settings.beforeUnload;

                // Check if pre-defined before unload function is still a function and run it in case it was overloaded by user
                if (flash.utils.object.isFunction(beforeUnload)) {
                    beforeUnload(template.type, params);
                }

                if (flash.utils.object.isFunction(template.callback)) {
                    template.callback(false);
                }

                // Check to make sure template controller has an unload before running the unload function
                if (template.controller &&
                    window[template.controller] &&
                    flash.utils.object.isFunction(window[template.controller].unload)) {
                    window[template.controller].unload(params);
                }

                runAfterUnload(template.type, params);
            };

            // #endregion unload

            // #region object.Template.prototype.add

            /**
             * Add the template to the client browser session
             * @param {Object} params - The object containing the parameters
             */
            object.Template.prototype.add = function (params) {
                var template = this;

                templates.push(template);

                template.init(params);
            };

            // #endregion object.Template.prototype.add

            // #region object.Template.prototype.display

            /**
             * Inject the template into the DOM and run before load manipulation to the HTML string
             * @param {String} preparedHtml - The HTML string of the template to load
             * @param {Object} params - The object containing the parameters
             * @param {Function} pageCallback - The function containing addtional steps for after loading template has completed
             */
            object.Template.prototype.display = function (preparedHtml, params, pageCallback) {
                var template = this;

                if (template.type === self.types.MODAL) {
                    displayModal(template, preparedHtml, params, pageCallback);
                } else {
                    display(template, preparedHtml, params, template.type === self.types.PARTIAL ? null : function () {
                        self.setDocumentTitle(template.title);
                        self.setActiveTab(template.tab);

                        $("body").removeClass(function (index, className) {
                            return (className.match(/\b\S+Tab/g) || []).join(" ");
                        });

                        $("body").addClass(template.tab);
                    }, pageCallback);
                }
            };

            // #endregion object.Template.prototype.display

            // #region object.Template.prototype.init

            /**
             * Initiate the template display using the controller init function, if controller exists
             * @param {Object} params - The object containing the parameters
             */
            object.Template.prototype.init = function (params) {
                var template = this;

                // Check if the controller exists, then call the controller init function, else display the template
                if (template.controller &&
                    window[template.controller] &&
                    flash.utils.object.isFunction(window[template.controller].init)) {
                    var $templateHtml = convertHtmlStringToJqueryObject(template.html),
                        callback = function (pageCallback) {
                            template.display($templateHtml.html(), params, pageCallback);
                        };

                    window[template.controller].init(callback, params, $templateHtml);
                } else {
                    log.warning(
                        "View for '" + template.hash + "' does not have a controller. By default, a view does not need a controller, therefore, ignore this warning if excluding a controller was intentional.",
                        "templating.object.template.prototype.init");

                    template.display(template.html, params);
                }
            };

            // #endregion object.Template.prototype.init

            // #region object.Template.prototype.preloadCallback

            /**
             * Preload callback to check if all resouces have been loaded
             * @param {Object} $data - The jQuery object containing the HTML of the template
             * @param {Object} $element - The element that has been loaded
             * @param {Number} elementLoadCounter - The remaining element count to load
             * @param {Object} params - The object containing the parameters
             * @param {String} src - The unqiue source path of the resource to add to client browser session
             */
            object.Template.prototype.preloadCallback = function ($data, $element, elementLoadCounter, params, src) {
                var template = this;

                if (src) {
                    loadedResources.push(src);
                }

                // Remove the script element in order to reduce loading same script after initial load
                if ($element.is("script") || $element.is("link")) {
                    $element.remove();
                }

                if (elementLoadCounter <= 0) {
                    template.html = $data.html();

                    template.add(params);
                }
            };

            // #endregion object.Template.prototype.preloadCallback

            // #region object.Template.prototype.preload

            /**
             * Preload all image and script resources within the template HTML
             * @param {String} html - The HTML string of the template to load
             * @param {Object} params - The object containing the parameters
             */
            object.Template.prototype.preload = function (html, params) {
                var template = this,
                    $html = convertHtmlStringToJqueryObject(html),
                    elementsToLoad = "script[src],img[src],link[href]";

                if ($html.find(elementsToLoad).length > 0) {
                    var elementLoadCounter = $html.find(elementsToLoad).length;

                    $html.find(elementsToLoad).each(function () {
                        var $element = $(this),
                            src = $element.is("link") ? $element.attr("href") : $element.attr("src");

                        if (!src || isResourceLoaded(src)) {
                            template.preloadCallback($html, $element, --elementLoadCounter, params);
                        } else {
                            if ($element.is("img")) {
                                flash.http.getImage(src, function () {
                                    template.preloadCallback($html, $element, --elementLoadCounter, params, src);
                                });
                            } else if ($element.is("script")) {
                                flash.http.getScript(src, function () {
                                    template.preloadCallback($html, $element, --elementLoadCounter, params, src);
                                });
                            } else if ($element.is("link")) {
                                flash.http.getCss(src, $element.attr("media"), function () {
                                    template.preloadCallback($html, $element, --elementLoadCounter, params, src);
                                });
                            }
                        }
                    });
                } else {
                    template.html = $html.html();

                    template.add(params);
                }
            };

            // #endregion object.Template.prototype.preload

            // #region object.Template.prototype.request

            /**
             * Load the HTML data from the server using a HTTP GET request
             * @param {String} url - The url of the view (html) to load
             * @param {Object} params - The object containing the parameters
             */
            object.Template.prototype.request = function (url, params) {
                var template = this;

                flash.http.get(
                    url,
                    function (data) {
                        if (!data.Status) {
                            template.preload(data, params);
                        } else if (data.Status === responseStatuses.ERROR) {
                            flash.utils.displayErrorPage(data.Message);
                        } else if (data.Status === responseStatuses.SUCCESS) {
                            flash.utils.displayMessagePage(flash.alert.types.SUCCESS, data.Message);
                        } else if (data.Status === responseStatuses.WARNING) {
                            flash.utils.displayMessagePage(flash.alert.types.WARNING, data.Message);
                        }
                    }
                );
            };

            // #endregion object.Template.prototype.request

            // #endregion Methods

            // #endregion Public

            return self;
        })(),

        // #endregion templating

        // #region tracking

        /**
         * Private self executing function containing the tracking functions
         */
        tracking = (function () {
            var self = {};

            // #region Public

            // #region Methods

            // #region loadGoogleAnalytics

            /**
             * Load google analytics libraries
             */
            self.loadGoogleAnalytics = function () {
                var googleAnalyticsTrackingCode = application.settings.googleAnalyticsTrackingCode;

                // Only load google analytics if tracking code was supplied
                if (!flash.utils.object.isString(googleAnalyticsTrackingCode)) {
                    return;
                }

                (function (i, s, o, g, r, a, m) {
                    i["GoogleAnalyticsObject"] = r; i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }, i[r].l = 1 * new Date(); a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
                })(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

                ga("create", googleAnalyticsTrackingCode, "auto");
            };

            // #endregion loadGoogleAnalytics

            // #region sendGoogleAnalyticsPageView

            /**
             * Send google analytics page view data
             */
            self.sendGoogleAnalyticsPageView = function () {
                var googleAnalyticsTrackingCode = application.settings.googleAnalyticsTrackingCode;

                // Only send google analytics page view data if tracking code was supplied
                if (!flash.utils.object.isString(googleAnalyticsTrackingCode)) {
                    return;
                }

                ga("send", "pageview", window.location.pathname + window.location.search + window.location.hash);
            };

            // #endregion sendGoogleAnalyticsPageView

            // #endregion Methods

            // #endregion Public

            return self;
        })(),

        // #endregion tracking

        // #region routing

        /**
         * Private self executing function containing the routing functions
         */

        routing = (function () {
            var self = {},

            // #region Private

            // #region Objects

            // #region struct

                struct = {
                    // #region Match

                    /**
                     * The Match object constructor
                     * @param {String} route - The matching route
                     * @param {Object} params - The object containing the named parameters
                     */
                    Match: function (route, params) {
                        this.route = route;
                        this.params = params;
                    },

                    // #endregion Match

                    // #region Route

                    /**
                     * The Route object constructor
                     * @param {String} hash - The unique identifier of the route
                     * @param {Object} params - The object containing the parameters
                     * @param {Object} config - The object containing the route config settings
                     *      @param {Function} load - The function that is executed to load the template
                     *      @param {Object} params - The object containing the parameters
                     *      @param {String} path - The unique identifier of the route
                     *      @param {Boolean} regex - Does the route contain parameters
                     *      @param {String} title - The route title used for the document title
                     *      @param {Function} unload - The function that is executed to unload the template
                     */
                    Route: function (config) {
                        this.load = config.load;
                        this.params = config.params;
                        this.path = config.path;
                        this.regex = config.regex;
                        this.title = config.title;
                        this.unload = config.unload;
                    }

                    // #endregion Route
                },

            // #endregion struct

            // #region escapedRegexQueryIdentifier

                escapedRegexQueryIdentifier = "\\?",

            // #endregion escapedRegexQueryIdentifier

            // #region hashPrefix

                hashPrefix = "#/",

            // #endregion hashPrefix

            // #region namedParameterIdentifier

                namedParameterIdentifier = "{",

            // #endregion namedParameterIdentifier

            // #region popstateCallback

                popstateCallback = false,

            // #endregion popstateCallback

            // #region previousPath

                previousPath = null,

            // #endregion previousPath

            // #region queryIdentifier

                queryIdentifier = "?",

            // #endregion queryIdentifier

            // #region queryStringNameValueSeparator

                queryStringNameValueSeparator = "=",

            // #endregion queryStringNameValueSeparator

            // #region regexNamedParameters

                regexNamedParameters = /{\w+}/g,

            // #endregion regexNamedParameters

            // #region regexNonNamedParameters

                regexNonNamedParameters = /%s/g,

            // #endregion regexNonNamedParameters

            // #region regexNonNamedParameterString

                regexNonNamedParameterString = "%s",

            // #endregion regexNonNamedParameterString

            // #region regexParametersMatchString

                regexParametersMatchString = "(.+)",

            // #endregion regexParametersMatchString

            // #region regexQueryIdentifier

                regexQueryIdentifier = "\?",

            // #endregion regexQueryIdentifier

            // #region regexStartAnchor

                regexStartAnchor = "^",

            // #endregion regexStartAnchor

            // #region reloadRequested

                reloadRequested = false,

            // #endregion reloadRequested

            // #region routePathDivider

                routePathDivider = "/",

            // #endregion routePathDivider

            // #region routePathDivider

                slashSlashProtocol = "//",

            // #endregion routePathDivider

            // #region templates

                routes = [];

            // #endregion templates

            // #endregion Objects

            // #region Methods

            // #region getRegexPath

            /**
             * Method to get the regex route path
             * @param {String} path - The route identifier, must be unique
             */
            function getRegexPath(path) {
                return regexStartAnchor + path.replace(regexQueryIdentifier, escapedRegexQueryIdentifier).replace(
                    path.indexOf(regexNonNamedParameterString) >= 0 ? regexNonNamedParameters : regexNamedParameters,
                    regexParametersMatchString);
            }

            // #endregion getRegexPath

            // #region get

            /**
             * Method to get the route object
             * @param {Object} config - The object containing the route config settings
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The route identifier, must be unique
             *      @param {String} prefix - The prefix for the controller and tab
             *      @param {Boolean} regex - Does the route contain parameters
             *      @param {String} title - The title of page
             *      @param {String} url - The url of the view (html) to load
             */
            function get(config) {
                var route = new struct.Route({
                    path: config.hash,
                    title: config.title
                });

                // Handle the route if it is a regex
                if (config.regex) {
                    if (config.hash.indexOf(regexNonNamedParameterString) < 0) {
                        var params = config.hash.match(regexNamedParameters),
                            hasQueryString = config.hash.indexOf(queryIdentifier) >= 0;

                        if (params) {
                            for (var i = 0; i < params.length; i++) {
                                var param = params[i],
                                    paramName = param.slice(1, -1);

                                if (hasQueryString) {
                                    var queryStringParam = paramName + queryStringNameValueSeparator + param;

                                    // Add the name value pair string (name=value) to the hash
                                    config.hash = config.hash.replace(param, queryStringParam);
                                }

                                params[i] = paramName;
                            }

                            route.params = params;
                        }
                    }

                    route.regex = true;
                    route.path = getRegexPath(config.hash);
                }

                route.load = function (params, callback) {
                    config.callback = callback;
                    config.params = params;

                    templating.loadPage(config);
                };

                route.unload = function (params) {
                    templating.unload(config.hash, params);
                };

                return route;
            }

            // #endregion get

            // #region toLowerCase

            /**
             * Lower case the route path, not incuding the querystring if it exists
             * @param {String} path - The route path unique identifier
             * @returns {String} The route path in lowercase
             */
            function toLowerCase(path) {
                if (!path) {
                    return null;
                }

                var caseSensitiveRoutes = application.settings.caseSensitiveRoutes;

                if (flash.utils.object.isBoolean(caseSensitiveRoutes) && caseSensitiveRoutes === true) {
                    return path;
                }

                var queryIdentifierIndex = path.indexOf(queryIdentifier),
                    origin = queryIdentifierIndex >= 0 ? path.substr(0, queryIdentifierIndex) : path,
                    queryString = queryIdentifierIndex >= 0 ? path.substr(queryIdentifierIndex) : "",
                    routeParts = origin.split(routePathDivider);

                for (var i = 0; i < routeParts.length; i++) {
                    // Ignore named parameters to keep case sensitivity
                    if (routeParts[i].indexOf(namedParameterIdentifier) >= 0) {
                        continue;
                    }

                    routeParts[i] = routeParts[i].toLowerCase();
                }

                return routeParts.join(routePathDivider) + queryString;
            }

            // #endregion toLowerCase

            // #region getMatch

            /**
             * Try to find the matching route in the client browser session
             * @param {String} path - The unique identifier of the route
             * @returns {Object} The match object containing the route and params
             */
            function getMatch(path) {
                var pathLower = toLowerCase(path);
                
                for (var i = routes.length - 1; i >= 0; i--) {
                    var route = routes[i];
                    
                    if (route.regex === true) {
                        var regExp = new RegExp(route.path);

                        if (!regExp.test(path) && !regExp.test(pathLower)) {
                            continue;
                        }
                        
                        var map,
                            params = path.match(regExp);

                        if (params) {
                            // Remove the static part of the hash
                            params = params.slice(1, params.length);

                            // Get the hashmap of named parameters if they are part of the unique hash
                            if (route.params) {
                                map = {};

                                for (var j = 0; j < route.params.length; j++) {
                                    if (!route.params[j] || !params[j]) {
                                        break;
                                    }

                                    map[route.params[j]] = params[j];
                                }
                            }
                        }

                        return new struct.Match(route, map || params);
                    } else if (path === route.path || pathLower === route.path) {
                        return new struct.Match(route);
                    }
                }

                return null;
            }

            // #endregion getMatch

            // #region load

            /**
             * Method to load the requested route path
             * @param {String} path - The requested route path
             */
            function load(path) {
                self.currentPath = self.buildPath(path);

                var match = getMatch(self.currentPath);
                
                if (match) {
                    match.route.load(match.params, function (load) {
                        if (load !== true) {
                            return;
                        }

                        var type = flash.utils.object.isBoolean(self.html5Mode)
                            ? (self.html5Mode === true && self.currentPath === routePathDivider) ||
                            (self.html5Mode === false && self.currentPath === hashPrefix)
                                ? "website"
                                : "article"
                            : null;

                        if (flash.utils.object.isBoolean(self.html5Mode) && self.html5Mode === true) {
                            if (popstateCallback === true) {
                                popstateCallback = false;
                            } else if (!previousPath || previousPath === self.currentPath) {
                                history.replaceState({ path: self.currentPath }, match.route.title, self.currentPath);
                            } else {
                                history.pushState({ path: self.currentPath }, match.route.title, self.currentPath);
                            }
                        }

                        previousPath = self.currentPath;

                        templating.addMetaTag({ property: "og:title", content: document.title });
                        templating.addMetaTag({ property: "og:type", content: type });
                        templating.addMetaTag({ property: "og:url", content: window.location.href });
                        templating.addLinkTag({ rel: "canonical", href: window.location.href });
                    });
                } else {
                    flash.utils.displayErrorPage(flash.http.statusCodes.NOTFOUND);
                }
            }

            // #endregion load

            // #region unload

            /**
             * Method to unload the previously requested route path
             */
            function unload() {
                var match = getMatch(previousPath);

                if (match) {
                    match.route.unload(match.params);
                }

                $(document).trigger("unloaded.flash.route");
            }

            // #endregion unload

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Objects

            // #region currentPath

            /**
             * @returns {String} the current route path
             */
            self.currentPath = null;

            // #endregion currentPath

            // #region html5Mode

            /**
             * @returns {Boolean} Whether the current routing method is HTML5Mode or hash
             */
            self.html5Mode = false;

            // #endregion html5Mode

            // #endregion Objects

            // #region Methods

            // #region add

            /**
             * Add route definition
             * @param {String} path - The route identifier, must be unique
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The title of page
             * @param {String} prefix - The prefix for the controller and tab
             * @param {Boolean} regex - Does the route contain parameters
             * @param {Boolean} caseSensitive - Is the route case sensitive
             * OR
             * @param {Object} config - The object containing the route config settings
             *      @param {Boolean} caseSensitive - Is the route case sensitive
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The route identifier, must be unique
             *      @param {String} prefix - The prefix for the controller and tab
             *      @param {Boolean} regex - Does the route contain parameters
             *      @param {String} title - The title of page
             *      @param {String} url - The url of the view (html) to load
             */
            self.add = function (path, url, title, prefix, regex, caseSensitive) {
                var config = flash.utils.object.isObject(arguments[0]) ? arguments[0] : {
                    hash: path,
                    prefix: prefix,
                    regex: regex,
                    title: title,
                    url: url
                };

                if (!flash.utils.object.isString(config.url)) {
                    log.error("Route url is not properly set.", "routing.add");

                    return;
                }

                if (!flash.utils.object.isString(config.prefix)) {
                    log.error("Route prefix is not properly set.", "routing.add");

                    return;
                }

                config.hash = self.buildPath(config.hash);

                if (!config.hash) {
                    return;
                }

                // Assign the appropriate path, depending on route case sensitivity
                if (!caseSensitive) {
                    config.hash = toLowerCase(config.hash);
                }

                var route = get(config);

                routes.push(route);
            };

            // #endregion add

            // #region buildPath

            /**
             * Build the hash to ensure a hashtag/slash prefix
             * @param {String} path - The route identifier, must be unique
             * @returns {String} The updated hash containing the hashtag/slash prefix
             */
            self.buildPath = function (path) {
                // Ensure the path is a string
                if (!flash.utils.object.isString(path)) {
                    log.error("Route path is not properly set.", "routing.buildPath");

                    return null;
                }

                if (flash.utils.object.isBoolean(self.html5Mode) && self.html5Mode === true) {
                    // Return the path if the hashtag/slash prefix exists
                    if (path.indexOf(routePathDivider) === 0) {
                        return path;
                    }

                    return routePathDivider + path;
                } else {
                    // Return the path if the hashtag/slash prefix exists
                    if (path.indexOf(hashPrefix) === 0) {
                        return path;
                    }

                    var hashtag = "#",
                        hashtagIndex = path.indexOf(hashtag),
                        slashIndex = path.indexOf(routePathDivider);

                    // Neither hashtag nor slash exist, prepend to the hash
                    if (hashtagIndex !== 0 && slashIndex !== 0) {
                        return hashPrefix + path;
                    }

                    // hashtag does not exist, but slash exists
                    if (hashtagIndex !== 0 && slashIndex === 0) {
                        return hashtag + path;
                    }

                    // hashtag exists, but slash does not
                    if (hashtagIndex === 0 && slashIndex !== 1) {
                        return hashPrefix + path.substring(1);
                    }

                    return null;
                }
            };

            // #endregion buildPath

            // #region getUnauthorizedRedirectPath

            /**
             * Method to get the unauthorized redirect path
             * @returns {String} The unauthorized redirect path including return url, when applicable
             */
            self.getUnauthorizedRedirectPath = function () {
                var unauthorizedRedirectPath = application.settings.unauthorizedRedirectPath;

                if (!flash.utils.object.isString(unauthorizedRedirectPath)) {
                    log.error(
                        "application.settings.unauthorizedRedirectPath is not properly set.",
                        "routing.getUnauthorizedRedirectPath");

                    return null;
                }

                var returnUrl = encodeURIComponent(window.location.href);

                // Only attach the return URL if current page is not an error page
                if (returnUrl.indexOf("error") < 0) {
                    var returnUrlParameter = "?returnUrl=";

                    unauthorizedRedirectPath += returnUrlParameter + returnUrl;
                }

                return unauthorizedRedirectPath;
            };

            // #endregion getUnauthorizedRedirectPath

            // #region init

            /**
             * Initialization of the routing to handle first load
             */
            self.init = function () {
                if (flash.utils.object.isBoolean(routing.html5Mode) && routing.html5Mode === true) {
                    var href = window.location.href,
                        path = href.replace(window.location.origin, "");

                    load(path);

                    // Bind the popstate event
                    popstate.bind(function (e) {
                        var state = e.originalEvent.state;

                        if (state && state.path) {
                            popstateCallback = true;

                            unload();
                            load(state.path);
                        }
                    });
                } else {
                    // Bind the routing listener to the hashchange event
                    hashchange.bind(function () {
                        if (reloadRequested) {
                            return;
                        }

                        unload();
                        load(window.location.hash || hashPrefix);
                    });

                    load(window.location.hash || hashPrefix);
                }
            };

            // #endregion init

            // #region listener

            /**
             * Listener to be executed when hashchange event is fired
             */
            self.listener = function () {
                var anchorExclusionRoutingSelector = application.settings.anchorExclusionRoutingSelector;

                if (!flash.utils.object.isString(anchorExclusionRoutingSelector)) {
                    log.error(
                        "application.settings.anchorExclusionRoutingSelector is not properly set.",
                        "routing.listener");

                    return;
                }

                var anchorSelector = "a:not(" + anchorExclusionRoutingSelector + ")";

                $(document).off("click.flash", anchorSelector).on("click.flash", anchorSelector, function (e) {
                    e.preventDefault();

                    var $this = $(this),
                        path = $this.attr("href");

                    if (flash.utils.object.isBoolean(self.html5Mode) && self.html5Mode === true) {
                        unload();

                        load(path);
                    } else {
                        path = self.buildPath(path);

                        if (window.location.hash !== "" && path === window.location.hash) {
                            routing.redirect(path);
                        } else {
                            window.location = self.buildPath(path);
                        }
                    }

                    $this.blur();
                });
            };

            // #endregion listener

            // #region redirect

            /**
             * Redirect the window to the new path
             * @param {String} path - The route identifier to load
             */
            self.redirect = function (path) {
                if (!flash.utils.object.isString(path)) {
                    log.error("Route path is not properly set.", "routing.buildPath");

                    return;
                }

                var slashSlashIndex = path.indexOf(slashSlashProtocol);

                // Check if the path is not an absolute url (account for http: or https:)
                if (slashSlashIndex < 0 || slashSlashIndex > 6) {
                    if (flash.utils.object.isBoolean(self.html5Mode) && self.html5Mode === true) {
                        unload();
                        load(path);
                    } else {
                        path = self.buildPath(path);

                        var pathLower = toLowerCase(path);

                        if (window.location.hash === path || window.location.hash === pathLower) {
                            unload();
                            load(path);
                        } else {
                            window.location.hash = path;
                        }
                    }
                } else {
                    templating.displayPageLoading();

                    window.location = path;
                }
            };

            // #endregion redirect

            // #region reload

            /**
             * reload the window to the new path
             * @param {String} path - The route identifier to load
             */
            self.reload = function (path) {
                if (!flash.utils.object.isString(path)) {
                    log.error("Route path is not properly set.", "routing.buildPath");

                    return;
                }

                templating.displayPageLoading();

                var slashSlashIndex = path.indexOf(slashSlashProtocol);

                if (!flash.utils.object.isBoolean(self.html5Mode) || self.html5Mode !== true) {
                    reloadRequested = true;
                }

                // Check if the path is not an absolute url (account for http: or https:)
                if (slashSlashIndex < 0 || slashSlashIndex > 6) {
                    path = self.buildPath(path);
                }

                window.location = path;

                if (!flash.utils.object.isBoolean(self.html5Mode) || self.html5Mode !== true) {
                    // Reload page if a hash prefix exists, since this would trigger a hash change only
                    if (path.indexOf(hashPrefix) >= 0) {
                        window.location.reload();
                    }
                }
            };

            // #endregion reload

            // #endregion Methods

            // #endregion Public

            return self;
        })();

        // #endregion routing

        // #endregion Methods

        // #endregion Private

        // #region Public

        // #region Objects

        Object.defineProperties(flash, {
            // #region $alertTargetElement

            /**
             * @returns {Object} The current template target jQuery object for alerts
             */
            $alertTargetElement: {
                get: function () {
                    var alertModalTargetElementSelector = application.settings.alertModalTargetElementSelector,
                        alertPageTargetElementSelector = application.settings.alertPageTargetElementSelector;

                    if (!flash.utils.object.isString(alertModalTargetElementSelector)) {
                        log.error(
                            "application.settings.alertModalTargetElementSelector is not properly set.",
                            "flash.$templateContainerElement");

                        return null;
                    }

                    if (!flash.utils.object.isString(alertPageTargetElementSelector)) {
                        log.error(
                            "application.settings.alertPageTargetElementSelector is not properly set.",
                            "flash.$templateContainerElement");

                        return null;
                    }

                    var elementSelector = flash.utils.isModalActive()
                        ? alertModalTargetElementSelector
                        : alertPageTargetElementSelector;

                    return $(elementSelector);
                }
            },

            // #endregion $alertTargetElement

            // #region $parentElement

            /**
             * @returns {Object} The current template parent jQuery object
             */
            $parentElement: {
                get: function () {
                    var modalParentElementSelector = application.settings.modalParentElementSelector,
                        documentParentElementSelector = application.settings.documentParentElementSelector;

                    if (!flash.utils.object.isString(modalParentElementSelector)) {
                        log.error(
                            "application.settings.modalParentElementSelector is not properly set.",
                            "flash.$templateContainerElement");

                        return null;
                    }

                    if (!flash.utils.object.isString(documentParentElementSelector)) {
                        log.error(
                            "application.settings.documentParentElementSelector is not properly set.",
                            "flash.$templateContainerElement");

                        return null;
                    }

                    var elementSelector = flash.utils.isModalActive()
                        ? modalParentElementSelector
                        : documentParentElementSelector;

                    return $(elementSelector);
                }
            },

            // #endregion $parentElement

            // #region $templateContainerElement

            /**
             * @returns {Object} The application container jQuery object for template content
             */
            $templateContainerElement: {
                get: function () {
                    var templateContainerElementSelector = application.settings.templateContainerElementSelector;

                    if (!flash.utils.object.isString(templateContainerElementSelector)) {
                        log.error(
                            "application.settings.templateContainerElementSelector is not properly set.",
                            "flash.$templateContainerElement");

                        return null;
                    }

                    return $(templateContainerElementSelector);
                }
            },

            // #endregion $templateContainerElement

            // #region activeTab

            /**
             * @returns {String} The application active tab
             */
            activeTab: { get: function () { return application.activeTab; } },

            // #endregion activeTab

            // #region statusMessage

            /**
             * @returns {Object} The application status message object
             */
            statusMessage: { get: function () { return application.statusMessage; } },

            // #endregion statusMessage

            // #region templateContainerElementNode

            /**
             * @returns {Object} The application container element's node for template content
             */
            templateContainerElementNode: {
                get: function () {
                    return flash.$templateContainerElement.length > 0 ? flash.$templateContainerElement[0] : null;
                }
            },

            // #endregion templateContainerElementNode

            // #region title

            /**
             * @returns {String} The application title
             */
            title: { get: function () { return application.title; } },

            // #endregion title

            // #region version

            /**
             * @returns {String} The flash version
             */
            version: { value: "1.1.0" }

            // #endregion version
        });

        // #endregion Objects

        // #region Methods

        // #region run

        /**
         * Start the application
         * @param {String} title - The title of the application
         * @param {Object} options - The object containing settings to override
         * @param {Object} resources - The object containing the string resources to override
         */
        flash.run = function (title, options, resources) {
            var regexFormatItem = /{\d+}/g;

            application.title = title;

            if (options) {
                // Merge the default settings with the supplied options
                $.extend(true, application.settings, options);
            }

            if (resources) {
                // Merge the default resources with the supplied resources
                $.extend(true, application.resources, resources);
            }

            // Merge the application resources into the public resources object
            flash.resources = $.extend(true, {}, application.resources);

            // Extend the functionality for an Unauthorized message to add a sign in URL, if it is provided, and append
            // a return URL
            Object.defineProperty(flash.resources.errorMessages, "UNAUTHORIZED", {
                get: function () {
                    var unauthorizedRedirectPath = routing.getUnauthorizedRedirectPath();
                    var slashSlashIndex = unauthorizedRedirectPath.indexOf("//");

                    // Check if the path is not a fully defined url or fully defined url is not main (account for http: or https:)
                    if (slashSlashIndex < 0 || slashSlashIndex > 6) {
                        unauthorizedRedirectPath = routing.buildPath(unauthorizedRedirectPath);
                    }

                    return application.resources.errorMessages.UNAUTHORIZED.replace(
                        regexFormatItem,
                        flash.utils.buildUrl(unauthorizedRedirectPath));
                }
            });

            flash.template.addMetaTag({ name: "generator", content: "Flash " + flash.version });

            // Load google analytics tracking libraries
            tracking.loadGoogleAnalytics();

            // Remove the noscript element if one exists to reduce size of DOM
            $("noscript").remove();

            // Initialize routing
            routing.init();
        };

        // #endregion run

        // #region alert

        /**
         * Public self executing function containing the alert functions
         */
        flash.alert = (function () {
            var self = {},

            // #region Private

            // #region Objects

            // #region staticSelector

                staticSelector = ".static",

            // #endregion staticSelector

            // #region types

                types = {
                    DANGER: "danger",
                    INFO: "info",
                    SUCCESS: "success",
                    WARNING: "warning"
                };

            // #endregion types

            // #endregion Objects

            // #region Methods

            // #region display

            /**
             * Display the alert supplied
             * @param {Object} $statusMessageElement - The HTML status message object to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            function display($statusMessageElement, parentElementSelector, targetElementSelector) {
                // Get the jQuery parent element
                var $parentElement = parentElementSelector ? $(parentElementSelector) : flash.$parentElement;
                // Get the jQuery target element
                var $targetElement = targetElementSelector ? $(targetElementSelector) : flash.$alertTargetElement;

                // Prepend the new status message
                $targetElement.prepend($statusMessageElement);

                var disableScrollToForAlerts = application.settings.disableScrollToForAlerts;

                if (!flash.utils.object.isBoolean(disableScrollToForAlerts) || disableScrollToForAlerts === false) {
                    // Scroll to the status message instantly
                    flash.utils.scrollTo($parentElement, $targetElement);
                }
            }

            // #endregion display

            // #region create

            /**
             * Create and display an alert
             * @param {String} type - The type of the status message to display
             * @param {String} message - The status message to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            function create(type, message, parentElementSelector, targetElementSelector) {
                var dismissibleAlerts = application.settings.dismissibleAlerts;
                // Create the jQuery html object for the alert
                var $statusMessageElement = $("<div/>", {
                    "class": "alert alert-" +
                        type +
                        (flash.utils.object.isBoolean(dismissibleAlerts) && dismissibleAlerts
                            ? " alert-dismissible"
                            : ""),
                    "role": "alert"
                });

                // Check whether to display the dismissable button
                if (flash.utils.object.isBoolean(dismissibleAlerts) && dismissibleAlerts) {
                    message = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>" + message;
                }

                $statusMessageElement.html(message);

                // Display the alert
                display($statusMessageElement, parentElementSelector, targetElementSelector);
            }

            // #endregion create

            // #region getSelectorByType

            /**
             * Get the element selector by the supplied type, if it is supplied
             * @param {String} type - The type of the status message to check visibility
             * @returns {String} The alert selector
             */
            function getSelectorByType(type) {
                return type ? ".alert-" + type : ".alert-danger,.alert-info,.alert-success,.alert-warning";
            }

            // #endregion getSelectorByType

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Objects

            // #region types

            self.types = types;

            // #endregion types

            // #endregion Objects

            // #region Methods

            // #region create

            /**
             * Create and display an alert
             * @param {String} type - The type of the status message to display
             * @param {String} message - The status message to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            self.create = create,

            // #endregion create

            // #region danger

            /**
             * Display danger alert
             * @param {String} message - The status message to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            self.danger = function (message, parentElementSelector, targetElementSelector) {
                create(types.DANGER, message, parentElementSelector, targetElementSelector);
            };

            // #endregion danger

            // #region dangerDefault

            /**
             * Display default danger alert
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            self.dangerDefault = function (parentElementSelector, targetElementSelector) {
                create(
                    types.DANGER,
                    flash.resources.errorMessages.DEFAULT,
                    parentElementSelector,
                    targetElementSelector);
            };

            // #endregion dangerDefault

            // #region info

            /**
             * Display info alert
             * @param {String} message - The status message to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            self.info = function (message, parentElementSelector, targetElementSelector) {
                create(types.INFO, message, parentElementSelector, targetElementSelector);
            };

            // #endregion info

            // #region isVisible

            /**
             * Check if any, or suppled type, alerts exist that are not static
             * @param {String} type - The type of the status message to check visibility
             * @returns {Boolean} Is an alert of the supplied type visible
             */
            self.isVisible = function (type) {
                // Get the element selector for the supplied type
                var selector = getSelectorByType(type);

                // Return whether alerts exist that are not static
                return $(selector).not(staticSelector).length > 0;
            };

            // #endregion isVisible

            // #region reset

            /**
             * Remove all, or supplied type, alerts that are not static
             * @param {String} type - The type of the status message to reset
             */
            self.reset = function (type) {
                // Get the element selector for the supplied type
                var selector = getSelectorByType(type);

                // Remove alerts that exist that are not static
                $(selector).not(staticSelector).remove();
            };

            // #endregion reset

            // #region success

            /**
             * Display success alert
             * @param {String} message - The status message to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            self.success = function (message, parentElementSelector, targetElementSelector) {
                create(types.SUCCESS, message, parentElementSelector, targetElementSelector);
            };

            // #endregion success

            // #region warning

            /**
             * Display warning alert
             * @param {String} message - The status message to attach to the target DOM element
             * @param {String} parentElementSelector - The jQuery parent selector used to find the HTML element within the DOM to attach the alert to
             * @param {String} targetElementSelector - The jQuery target selector used to find the HTML element within the parent DOM object to attach the alert to
             */
            self.warning = function (message, parentElementSelector, targetElementSelector) {
                create(types.WARNING, message, parentElementSelector, targetElementSelector);
            };

            // #endregion warning

            // #endregion Methods

            // #endregion Public

            return self;
        })();

        // #endregion alert

        // #region http

        /**
         * Public self executing function containing the HTTP request functions
         */
        flash.http = (function () {
            var self = {};

            // #region Private

            // #region Methods

            // #region displayFormErrors

            /**
             * Display the form errors returned by the HTTP POST request
             * @param {String} elementSelector - The form element selector
             * @param {Object} responseText - The response object containing the ModelState object with errors
             */
            function displayFormErrors(elementSelector, responseText) {
                try {
                    // Parse the JSON response string into an object
                    var response = JSON.parse(responseText);

                    // Make sure the response is an object
                    if (!response) {
                        flash.alert.dangerDefault();

                        return;
                    }

                    if (response.Message) {
                        // Display the error message
                        flash.alert.danger(response.Message);
                    }

                    // Make sure response contains the ModelState object with errors
                    if (!response.ModelState) {
                        if (!response.Message) {
                            flash.alert.dangerDefault();
                        }

                        return;
                    }

                    // Run through each error in the ModelState dictionary and display a help block for each error
                    for (var key in response.ModelState) {
                        if (response.ModelState.hasOwnProperty(key)) {
                            if (key === "_FORM") {
                                flash.alert.reset();
                                flash.alert.danger(response.ModelState[key][0]);

                                continue;
                            }

                            flash.utils.addHelpBlock(elementSelector, key, response.ModelState[key][0]);
                        }
                    }
                } catch (e) {
                    log.error(e, "flash.http.displayFormErrors");

                    flash.alert.dangerDefault();
                }
            }

            // #endregion displayFormErrors

            // #region triggerRedirect

            /**
             * Trigger a redirect to the supplied path in the response
             * @param {Object} responseText - The response object containing the path string
             */
            function triggerRedirect(responseText) {
                try {
                    // Parse the JSON response string into an object
                    var response = JSON.parse(responseText);

                    // Make sure the response is an object and contains the Path string
                    if (response && response.Path) {
                        routing.reload(response.Path);

                        return;
                    }

                    // If the response object did not contain the Path string, redirect to the error page
                    flash.utils.displayErrorPage(flash.http.statusCodes.BADREQUEST);
                } catch (e) {
                    log.error(e, "flash.http.triggerRedirect");

                    flash.utils.displayErrorPage(flash.http.statusCodes.BADREQUEST);
                }
            }

            // #endregion triggerRedirect

            // #region doneCallback

            /**
             * The fucntion executed when the HTTP request succeeds
             * @param {String} verb - The HTTP Verb of the request
             * @param {*} data - A virtual type object that is returned from the server
             * @param {String} textStatus - A string describing the status of the request
             * @param {Object} jqXhr - The XMLHttpRequest object
             * @param {Function} callback - The function that is executed when the request finishes
             * @param {String} elementSelector - The form element selector
             */
            function doneCallback(verb, data, textStatus, jqXhr, callback, elementSelector) {
                logAjaxStatus(textStatus, verb.toLowerCase());

                if (verb === self.verbs.POST || verb === self.verbs.PUT) {
                    // Reset the alerts and validation before handling the success 
                    flash.alert.reset();

                    if (elementSelector) {
                        flash.utils.resetValidation(elementSelector);
                    }
                }

                if (flash.utils.object.isFunction(callback)) {
                    callback(data);
                }
            }

            // #endregion doneCallback

            // #region failCallback

            /**
             * The fucntion executed when the HTTP request fails
             * @param {String} verb - The HTTP Verb of the request
             * @param {Object} jqXhr - The XMLHttpRequest object
             * @param {String} textStatus - A string describing the status of the request
             * @param {String} errorThrown - A string describing the type of error that occurred
             * @param {Function} callback - The function that is executed when the request finishes
             * @param {String} elementSelector - The form element selector
             */
            function failCallback(verb, jqXhr, textStatus, errorThrown, callback, elementSelector) {
                logAjaxStatus(textStatus, verb.toLowerCase(), errorThrown);

                if (jqXhr.status === self.statusCodes.ABORT || jqXhr.readyState === self.statusCodes.ABORT) {
                    return;
                }

                templating.clear();

                if (verb === self.verbs.POST || verb === self.verbs.PUT) {
                    // Reset the alerts and validation before handling the error 
                    flash.alert.reset();

                    if (elementSelector) {
                        flash.utils.resetValidation(elementSelector);
                    }
                }

                var executeCallback = false;

                // Handle the error based on the returned status code
                if (jqXhr.status === self.statusCodes.REDIRECT) {
                    triggerRedirect(jqXhr.responseText);
                } else if (jqXhr.status === self.statusCodes.BADREQUEST &&
                    (verb === self.verbs.POST || verb === self.verbs.PUT)) {
                    if (elementSelector) {
                        displayFormErrors(elementSelector, jqXhr.responseText);
                    }

                    executeCallback = true;
                } else if (jqXhr.status === self.statusCodes.UNAUTHORIZED) {
                    var unauthroizedAutoRedirect = application.settings.unauthroizedAutoRedirect;

                    if (flash.utils.object.isBoolean(unauthroizedAutoRedirect) && unauthroizedAutoRedirect === true) {
                        var unauthorizedRedirectPath = routing.getUnauthorizedRedirectPath();

                        routing.reload(unauthorizedRedirectPath);
                    } else if (verb === self.verbs.POST || verb === self.verbs.PUT) {
                        flash.alert.danger(flash.resources.errorMessages.UNAUTHORIZED);

                        executeCallback = true;
                    } else {
                        flash.utils.displayErrorPage(flash.http.statusCodes.UNAUTHORIZED);
                    }
                } else if (jqXhr.status === self.statusCodes.FORBIDDEN) {
                    flash.utils.displayErrorPage(flash.http.statusCodes.FORBIDDEN);
                } else if (jqXhr.status === self.statusCodes.NOTFOUND) {
                    flash.utils.displayErrorPage(flash.http.statusCodes.NOTFOUND);
                } else {
                    if (verb === self.verbs.POST || verb === self.verbs.PUT) {
                        flash.alert.dangerDefault();

                        executeCallback = true;
                    } else {
                        flash.utils.displayErrorPage(flash.http.statusCodes.BADREQUEST);
                    }
                }

                if ((verb === self.verbs.POST || verb === self.verbs.PUT) && executeCallback &&
                    flash.utils.object.isFunction(callback)) {
                    callback(jqXhr);
                }
            }

            // #endregion failCallback

            // #region alwaysCallback

            /**
             * The fucntion executed when the HTTP request finishes
             * @param {String} verb - The HTTP Verb of the request
             * @param {Object} jqXhr - The XMLHttpRequest object
             * @param {String} textStatus - A string describing the status of the request
             * @param {String} elementSelector - The form element selector
             */
            function alwaysCallback(verb, jqXhr, textStatus, elementSelector) {
                if (verb === self.verbs.DELETE || verb === self.verbs.GET) {
                    return;
                }

                logAjaxStatus(textStatus, verb.toLowerCase());

                if (elementSelector &&
                    jqXhr.status !== self.statusCodes.REDIRECT &&
                    jqXhr.status !== self.statusCodes.FORBIDDEN) {
                    flash.utils.toggleSubmitButton(elementSelector);
                }
            }

            // #endregion alwaysCallback

            // #region logAjaxStatus

            /**
             * The fucntion executed when the HTTP request finishes
             * @param {String} textStatus - A string describing the status of the request
             * @param {String} functionName - The name of the calling function
             * @param {String} errorThrown - A string describing the type of error that occurred
             */
            function logAjaxStatus(textStatus, functionName, errorThrown) {
                var statusMessage = "Status: " + textStatus;
                var location = "flash.http." + functionName;

                if (flash.utils.object.isString(errorThrown)) {
                    log.error(statusMessage + ", Error: " + errorThrown, location);
                } else {
                    log.info(statusMessage, location);
                }
            }

            // #endregion logAjaxStatus

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Objects

            // #region statusCodes

            self.statusCodes = {
                ABORT: 0,
                BADREQUEST: 400,
                FORBIDDEN: 403,
                NOTFOUND: 404,
                REDIRECT: 302,
                UNAUTHORIZED: 401
            };

            // #endregion statusCodes

            // #region verbs

            self.verbs = {
                DELETE: "DELETE",
                GET: "GET",
                POST: "POST",
                PUT: "PUT"
            };

            // #endregion verbs

            // #endregion Objects

            // #region Methods

            // #region ajax

            /**
             * Create and execute an HTTP request and return the jqXHR object
             * @param {String} verb - The HTTP Verb of the request
             * @param {String} url - The URL to which the request is sent
             * @param {Function} callback - The function that is executed when the request completes
             * @param {(Object|String)} obj - A plain object or string that is sent to the server with the request
             * @param {String} elementSelector - The form element selector
             */
            self.ajax = function (verb, url, callback, obj, elementSelector) {
                var config = { url: flash.utils.buildUrl(url), method: verb };

                // Configure HTTP request based on verb
                if (verb === self.verbs.DELETE || verb === self.verbs.GET) {
                    config.cache = false;
                    config.async = true;
                }
                else if (verb === self.verbs.POST || verb === self.verbs.PUT) {
                    config.data = obj;
                }

                // Send and handle HTTP request
                return $.ajax(config)
                    .done(function (data, textStatus, jqXhr) {
                        doneCallback(verb, data, textStatus, jqXhr, callback, elementSelector);
                    })
                    .fail(function (jqXhr, textStatus, errorThrown) {
                        failCallback(verb, jqXhr, textStatus, errorThrown, callback, elementSelector);
                    })
                    .always(function (jqXhr, textStatus) {
                        alwaysCallback(verb, jqXhr, textStatus, elementSelector);
                    });
            };

            // #endregion ajax

            // #region delete

            /**
             * Delete data from the server using a HTTP DELETE request and return the jqXHR object
             * @param {String} url - The URL to which the request is sent
             * @param {Function} callback - The function that is executed if the request succeeds
             */
            self.delete = function (url, callback) {
                return self.ajax(self.verbs.DELETE, url, callback);
            };

            // #endregion delete

            // #region get

            /**
             * Load data from the server using a HTTP GET request and return the jqXHR object
             * @param {String} url - The URL to which the request is sent
             * @param {Function} callback - The function that is executed if the request succeeds
             */
            self.get = function (url, callback) {
                // TODO: Consider adding paramter to determine if error should display on current page or display error page
                return self.ajax(self.verbs.GET, url, callback);
            };

            // #endregion get

            // #region getCss

            /**
             * Load a CSS file from the server using a GET HTTP request
             * @param {String} href - The source of the css to load
             * @param {String} media - The media type of the css to load
             * @param {Function} callback - The function that is executed when the request completes
             */
            self.getCss = function (href, media, callback) {
                var styleSheet = document.createElement("link"),
                    head = document.getElementsByTagName("head")[0];

                styleSheet.rel = "stylesheet";
                styleSheet.href = href;
                styleSheet.media = "only x";

                head.appendChild(styleSheet);

                var interval = setInterval(function () {
                    var sheets = document.styleSheets;

                    for (var i = 0; i < sheets.length; i++) {
                        if (sheets[i].href !== styleSheet.href) {
                            continue;
                        }

                        clearInterval(interval);

                        styleSheet.media = media || "all";

                        break;
                    }
                });

                if (flash.utils.object.isFunction(callback)) {
                    callback();
                }
            };

            // #endregion getCss

            // #region getImage

            /**
             * Load an image from the server using a GET HTTP request
             * @param {String} src - The source of the image to load
             * @param {Function} callback - The function that is executed when the request completes
             */
            self.getImage = function (src, callback) {
                $("<img/>", {
                    src: flash.utils.buildUrl(src)
                }).on("load", function () {
                    if (flash.utils.object.isFunction(callback)) {
                        callback();
                    }
                });
            };

            // #endregion getImage

            // #region getScript

            /**
             * Load a JavaScript file from the server using a GET HTTP request, then execute it
             * @param {String} url - The URL to which the request is sent
             * @param {Function} callback - The function that is executed when the request completes
             */
            self.getScript = function (url, callback) {
                $.getScript(flash.utils.buildUrl(url))
                    .fail(function (jqXhr, settings, exception) {
                        log.error("Failed to download '" + url + "', Exception: " + exception, "flash.http.getScript");
                    })
                    .always(function (jqXhr, textStatus) {
                        logAjaxStatus(textStatus, "getScript");

                        if (flash.utils.object.isFunction(callback)) {
                            callback();
                        }
                    });
            };

            // #endregion getScript

            // #region post

            /**
             * Push data from the server using a HTTP POST request and return the jqXHR object
             * @param {String} elementSelector - The form element selector
             * @param {String} url - The URL to which the request is sent
             * @param {(Object|String)} obj - A plain object or string that is sent to the server with the request
             * @param {Function} callback - The function that is executed when the request completes
             */
            self.post = function (elementSelector, url, obj, callback) {
                flash.utils.toggleSubmitButton(elementSelector);

                return self.ajax(self.verbs.POST, url, callback, obj, elementSelector);
            };

            // #endregion post

            // #region put

            /**
             * Push data to the server using a HTTP PUT request and return the jqXHR object
             * @param {String} elementSelector - The form element selector
             * @param {String} url - The URL to which the request is sent
             * @param {(Object|String)} obj - A plain object or string that is sent to the server with the request
             * @param {Function} callback - The function that is executed when the request completes
             */
            self.put = function (elementSelector, url, obj, callback) {
                flash.utils.toggleSubmitButton(elementSelector);

                return self.ajax(self.verbs.PUT, url, callback, obj, elementSelector);
            };

            // #endregion put

            // #endregion Methods

            // #endregion Public

            return self;
        })();

        // #endregion http

        // #region route

        /**
         * Public self executing function containing the routing functions
         */
        flash.route = (function () {
            var self = {};

            // #region Public

            // #region Objects

            Object.defineProperties(self, {
                // #region currentPath

                /**
                 * @returns {String} the current route path
                 */
                currentPath: {
                    get: function () {
                        return routing.currentPath;
                    }
                },

                // #endregion currentPath

                // #region html5Mode

                /**
                 * @returns {Boolean} Whether the current routing method is HTML5Mode or hash
                 */
                html5Mode: {
                    get: function () {
                        return routing.html5Mode;
                    },
                    set: function (value) {
                        var historyApiSupport = !!(window.history && history.pushState);

                        if (historyApiSupport) {
                            routing.html5Mode = value;
                        }
                    }
                }

                // #endregion html5Mode
            });

            // #endregion Objects

            // #region Methods

            // #region add

            /**
             * Add route definition
             * @param {String} path - The route identifier, must be unique
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The title of page
             * @param {String} prefix - The prefix for the controller and tab
             * @param {Boolean} regex - Does the route contain parameters
             * @param {Boolean} caseSensitive - Is the route case sensitive
             */
            self.add = routing.add;

            // #endregion add

            // #region redirect

            /**
             * Redirect the window to the new path
             * @param {String} path - The route identifier to load
             */
            self.redirect = routing.redirect;

            // #endregion redirect

            // #region reload

            /**
             * Reload the window to the new path
             * @param {String} path - The route identifier to load
             */
            self.reload = routing.reload;

            // #endregion reload

            // #endregion Methods

            // #endregion Public

            return self;
        })();

        // #endregion route

        // #region template

        /**
         * Public self executing function containing the templating functions
         */
        flash.template = (function () {
            var self = {};

            // #region Public

            // #region Objects

            // #region types

            self.types = templating.types;

            // #endregion types

            // #endregion Objects

            // #region Methods

            // #region addLinkTag

            /**
             * Add/update a link tag
             * @param {Object} attr - The link tag attributes
             */
            self.addLinkTag = templating.addLinkTag;

            // #endregion addLinkTag

            // #region addMetaTag

            /**
             * Add/update a meta tag
             * @param {Object} attr - The meta tag attributes
             */
            self.addMetaTag = templating.addMetaTag;

            // #endregion addMetaTag

            // #region clear

            /**
             * Clear the client browser session templates
             */
            self.clear = templating.clear;

            // #endregion clear

            // #region displayPageLoading

            /**
             * Display the page loading element on the view
             */
            self.displayPageLoading = templating.displayPageLoading;

            // #endregion displayPageLoading

            // #region hidePageLoading

            /**
             * Remove the page loading element from the view
             */
            self.hidePageLoading = templating.hidePageLoading;

            // #endregion hidePageLoading

            // #region load

            /**
             * Load the template for the supplied hash from client browser session or request new template
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} containerElementSelector - The container element selector used to prepend the template to
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} title - The template title used for the document title
             *      @param {Number} type - The template type
             *      @param {String} url - The url of the view (html) to load
             */
            self.load = templating.load;

            // #endregion load

            // #region loadModal

            /**
             * Load the modal template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadModal = templating.loadModal;

            // #endregion loadModal

            // #region loadPage

            /**
             * Load the page template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The template title used for the document title
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} title - The template title used for the document title
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadPage = templating.loadPage;

            // #endregion loadPage

            // #region loadPartial

            /**
             * Load the partial template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} containerElementSelector - The container element selector used to prepend the template to
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} containerElementSelector - The container element selector used to prepend the template to
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadPartial = templating.loadPartial;

            // #endregion loadPartial

            // #region removeLinkTag

            /**
             * Remove a link tag
             * @param {Object} attr - The link tag attributes
             */
            self.removeLinkTag = templating.removeLinkTag;

            // #endregion removeLinkTag

            // #region removeMetaTag

            /**
             * Remove a meta tag
             * @param {Object} attr - The meta tag attributes
             */
            self.removeMetaTag = templating.removeMetaTag;

            // #endregion removeMetaTag

            // #region setActiveTab

            /**
             * Set the application active tab and update the view with the active tab
             * @param {String} tab - The active tab object name
             */
            self.setActiveTab = templating.setActiveTab;

            // #endregion setActiveTab

            // #region setDocumentTitle

            /**
             * Set the document title
             * @param {string} pageTitle - The title of the template page that has been loaded
             */
            self.setDocumentTitle = templating.setDocumentTitle;

            // #endregion setDocumentTitle

            // #endregion Methods

            // #endregion Public

            return self;
        })();

        // #endregion template

        // #region utils

        /**
         * Public self executing function containing utility functions
         */
        flash.utils = (function () {
            var self = {},

            // #region Private

            // #region Objects

            // #region disabledAttrName

                disabledAttrName = "disabled",

            // #endregion disabledAttrName

            // #region emptyString

                emptyString = "",

            // #endregion emptyString

            // #region hashtag

                hashtag = "#",

            // #endregion hashtag

            // #region hasErrorClassName

                hasErrorClassName = "has-error",

            // #endregion hasErrorClassName

            // #region hasErrorSelector

                hasErrorSelector = "." + hasErrorClassName,

            // #endregion hasErrorSelector

            // #region helpBlockClassName

                helpBlockClassName = "help-block",

            // #endregion helpBlockClassName

            // #region helpBlockSelector

                helpBlockSelector = "." + helpBlockClassName,

            // #endregion helpBlockSelector

            // #region modalSelector

                modalSelector = ".modal",

            // #endregion modalSelector

            // #region modalSelectorData

                modalSelectorData = "bs" + modalSelector,

            // #endregion modalSelectorData

            // #region queryIdentifier

                queryIdentifier = "?",

            // #endregion queryIdentifier

            // #region queryStringParameterSeparator

                queryStringParameterSeparator = "&",

            // #endregion queryStringParameterSeparator

            // #region queryStringNameValueSeparator

                queryStringNameValueSeparator = "=",

            // #endregion queryStringNameValueSeparator

            // #region regexUrlHash

                regexUrlHash = /#.*$/,

            // #endregion regexUrlHash

            // #region regexUrlParamPrefix

                regexUrlParamPrefix = "([?&])",

            // #endregion regexUrlParamPrefix

            // #region regexUrlParamPostfix

                regexUrlParamPostfix = "=[^&]*",

            // #endregion regexUrlParamPostfix

            // #region regexUrlQuery

                regexUrlQuery = (/\?/),

            // #endregion regexUrlQuery

            // #region staticSelector

                staticSelector = ".static";

            // #endregion staticSelector

            // #endregion Objects

            // #region Methods

            // #region unbindEvent

            /**
             * Unbind the event handler attached by the on method
             * @param {String} eventType - The event type to unbind
             * @param {String} elementSelector - The selector which should match the one originally passed to the on method
             * @param {String} elementParentSelector - The parent selector containing the element that is being unbinded
             */
            function unbindEvent(eventType, elementSelector, elementParentSelector) {
                // If no parent element is supplied, default to document
                var $parentElement = $(elementParentSelector || document);

                if (elementSelector) {
                    $parentElement.off(eventType, elementSelector);
                } else {
                    $parentElement.off(eventType);
                }
            }

            // #endregion unbindEvent

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Methods

            // #region addHelpBlock

            /**
             * Add a help block to the form element containing an error
             * @param {String} elementSelector - The form selector containing the form element with an error
             * @param {String} key - The element id of the input element containing the error
             * @param {String} value - The value of the help block to display to the user
             */
            self.addHelpBlock = function (elementSelector, key, value) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.addHelpBlock");

                    return;
                }

                if (!key) {
                    log.error("Key is null or undefined.", "flash.utils.addHelpBlock");

                    return;
                }

                var $formElement = $(elementSelector).find(hashtag + key);

                if (!$formElement) {
                    log.error("Form element object is null or undefined.", "flash.utils.addHelpBlock");

                    return;
                }

                var $formGroupElement = $formElement.closest(".form-group");

                if (!$formGroupElement.length) {
                    log.error("Form group element object is null or undefined.", "flash.utils.addHelpBlock");

                    return;
                }

                var $helpText = $("<span/>", {
                    "class": helpBlockClassName
                }).html(value);

                $formGroupElement.addClass(hasErrorClassName);
                $formGroupElement.append($helpText);
            };

            // #endregion addHelpBlock

            // #region addUpdateQueryStringParam

            /**
             * Add or update a querystring paramter to an existing url
             * @param {String} url - The url to update
             * @param {String} key - The parameter key
             * @param {String} value - The parameter value
             * @returns {String} The updated url
             */
            self.addUpdateQueryStringParam = function (url, key, value) {
                var path = url.replace(regexUrlHash, ""),
                    hash = url.slice(path.length);

                path = path.replace(new RegExp(regexUrlParamPrefix + key + regexUrlParamPostfix, 'g'), "");
                hash = (regexUrlQuery.test(path) ? "&" : "?") + key + "=" + value + hash;

                return path + hash;
            };

            // #endregion addUpdateQueryStringParam

            // #region applyRowGrouping

            /**
             * Group the elements in the object into a row div
             * @param {Object} $elements - The list of elements to group into rows
             * @param {Number} elementsPerGroup - The number of elements per group
             */
            self.applyRowGrouping = function ($elements, elementsPerGroup) {
                if (!$elements.length) {
                    log.warning("Elements object is null or undefined", "flash.utils.applyRowGrouping");

                    return;
                }

                if (!self.object.isNumber(elementsPerGroup)) {
                    log.error("Elements per group is null or undefined", "flash.utils.applyRowGrouping");

                    return;
                }

                for (var i = 0; i < $elements.length; i += elementsPerGroup) {
                    $elements.slice(i, i + elementsPerGroup).wrapAll("<div class=\"row\" />");
                }
            };

            // #endregion applyRowGrouping

            // #region bindSubmitEvent

            /**
             * Bind the submit button to a flash post ajax method
             * @param {String} elementSelector - The form selector to bind the submit event to
             * @param {String} url - The url of the post request
             * @param {Function} callback - The function that is executed when the post request is done
             */
            self.bindSubmitEvent = function (elementSelector, url, callback) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.bindSubmitEvent");

                    return;
                }

                if (!url) {
                    log.error("URL is null or undefined.", "flash.utils.bindSubmitEvent");

                    return;
                }

                $(elementSelector).submit(function () {
                    flash.http.post(
                        this,
                        url,
                        $(this).serialize(),
                        function (data) {
                            if (self.object.isFunction(callback)) {
                                callback(data);
                            }
                        }
                    );

                    return false;
                });
            };

            // #endregion bindSubmitEvent

            // #region buildUrl

            /**
             * Build a url using the base root path unless url is relative or fully defined url
             * @param {String} url - The base url
             * @returns {String} The relative or fully defined built url
             */
            self.buildUrl = function (url) {
                var baseRootPath = application.settings.baseRootPath;
                var slashSlashIndex = url.indexOf("//");

                // Return url if absolute (account for http: or https:), not a string or already contains base root path
                if ((slashSlashIndex >= 0 && slashSlashIndex <= 6) ||
                    !self.object.isString(baseRootPath) ||
                    url.indexOf(baseRootPath) === 0) {
                    return url;
                }

                return baseRootPath + url;
            };

            // #endregion buildUrl

            // #region buildUrlWithQueryString

            /**
             * Build the url with an object as querystring parameters
             * @param {String} baseUrl - The base url
             * @param {Object} data - The object containing the parameters
             * @returns {String} The url containing the querystring parameters
             */
            self.buildUrlWithQueryString = function (baseUrl, data) {
                return baseUrl + (self.object.isObject(data) ? queryIdentifier + $.param(data) : "");
            };

            // #endregion buildUrlWithQueryString

            // #region clearStatusMessage

            /**
             * Clear the client browser session status message
             */
            self.clearStatusMessage = function () {
                application.statusMessage = null;
            }

            // #endregion clearStatusMessage

            // #region clearTemplates

            /**
             * Clear the client browser session templates
             */
            self.clearTemplates = function () {
                log.depreciated(
                    "This method is depreciated and will be removed in version 2.0. Please use flash.template.clear() instead.",
                    "flash.utils.clearTemplates");

                templating.clear();
            };

            // #endregion clearTemplates

            // #region convertObjectToQueryStringParamArray

            /**
             * Convert an object into an array of name value pairs
             * EXAMPLE:
                var obj = { id: 5, name: "John" };
                var params = flash.utils.convertObjectToQueryStringParamArray(obj);

                var paramId = params[0];
                var paramName = params[1];

                console.log(paramId); // -> id=5
                console.log(paramName); // -> name=John
             * @param {Object} obj - The object containing the parameters with values
             * @returns {Array} The array of name value pairs
             */
            self.convertObjectToQueryStringParamArray = function (obj) {
                if (!self.object.isObject(obj)) {
                    log.error("Object is null or undefined.", "flash.utils.convertObjectToQueryStringParamArray");

                    return null;
                }

                return $.param(obj).split(queryStringParameterSeparator);
            };

            // #endregion convertObjectToQueryStringParamArray

            // #region displayErrorPage

            /**
             * Redirect the user to the error page
             * @param {String} message - The message to display in the alert error box
             */
            self.displayErrorPage = function (message) {
                var errorPath = application.settings.errorPath;

                if (!self.object.isString(errorPath) && !self.object.isObject(errorPath)) {
                    log.error("application.settings.errorPath is not properly set.", "flash.utils.displayErrorPage");

                    return;
                }

                if (self.object.isString(message)) {
                    application.statusMessage = new object.StatusMessage(flash.alert.types.DANGER, message);

                    routing.redirect(self.object.isString(errorPath) ? errorPath : errorPath.defaultPath);
                } else {
                    routing.reload(errorPath[message] || errorPath.defaultPath);
                }
            };

            // #endregion displayErrorPage

            // #region displayMessagePage

            /**
             * Redirect the user to the message page
             * @param {String} type - The type of the alert
             * @param {String} message - The message to display in the alert
             * @param {String} description - The detailed description of the alert
             */
            self.displayMessagePage = function (type, message, description) {
                var messagePath = application.settings.messagePath;

                if (!self.object.isString(messagePath)) {
                    log.error("application.settings.messagePath is not properly set.", "flash.utils.displayMessagePage");

                    return;
                }

                application.statusMessage = new object.StatusMessage(type, message, description);

                routing.redirect(messagePath);
            };

            // #endregion displayMessagePage

            // #region extend

            /**
             * Method to extend the target object with objects from source, with support for KnockoutJS observables
             * @param {Object} target - The target object
             * @param {Object} source - The source object
             * @returns {Object} The target object
             */
            self.extend = function (target, source) {
                target = target || {};

                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        if (ko.isObservable(target[prop])) {
                            target[prop](source[prop]);
                        } else if (source[prop] && typeof source[prop] === "object") {
                            target[prop] = self.extend(target[prop], source[prop]);
                        } else {
                            target[prop] = source[prop];
                        }
                    }
                }

                return target;
            };

            // #endregion extend

            // #region getQueryString

            /**
             * Get the hashmap of the querystring (name value pairs) parameters string
             * @param {String} params - The querystring (name value pairs) parameters string
             * @returns {Object} The hashmap containing the querystring parameters
             */
            self.getQueryString = function (params) {
                if (!params) {
                    log.error("Params are null or undefined.", "flash.utils.getQueryString");

                    return null;
                }

                var queryString = {};

                if (flash.utils.object.isString(params)) {
                    params = params.split(queryStringParameterSeparator);
                }

                for (var i = 0; i < params.length; ++i) {
                    var param = params[i].replace(queryIdentifier, emptyString),
                        queryStringNameValueSeparatorIndex = param.indexOf(queryStringNameValueSeparator);

                    if (queryStringNameValueSeparatorIndex < 0) {
                        continue;
                    }

                    var paramName = param.substr(0, queryStringNameValueSeparatorIndex),
                        paramValue = param.substr(queryStringNameValueSeparatorIndex + 1);

                    queryString[paramName] = decodeURIComponent(paramValue);
                }

                return queryString;
            };

            // #endregion getQueryString

            // #region getSelectSelectedValues

            /**
             * Get the selected values from the select input element
             * @param {String} elementSelector - The selector of the select form element
             * @returns {Array} The array of selected values
             */
            self.getSelectSelectedValues = function (elementSelector) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.getSelectSelectedValues");

                    return null;
                }

                var selectedValues = [];

                $(elementSelector).children("option:selected").each(function () {
                    selectedValues.push($(this).val());
                });

                return selectedValues;
            };

            // #endregion getSelectSelectedValues

            // #region isBrowserMobile

            /**
             * Check if the user is browsing using a mobile browser
             * @returns {Boolean} Whether the browser is mobile
             */
            self.isBrowserMobile = function () {
                if (!MobileDetect) {
                    log.error("MobileDetect is undefined.", "flash.utils.isBrowserMobile");
                }

                var md = new MobileDetect(window.navigator.userAgent);

                return md.mobile() !== undefined && md.mobile() !== null && md.mobile() !== "";
            };

            // #endregion isBrowserMobile

            // #region isModalActive

            /**
             * Check if the modal is active on the screen
             * @returns {Boolean} Whether the modal is active on the screen
             */
            self.isModalActive = function () {
                return $(modalSelector).length &&
                    $(modalSelector).data(modalSelectorData) &&
                    $(modalSelector).data(modalSelectorData).isShown;
            };

            // #endregion isModalActive

            // #region loadModal

            /**
             * Load the modal template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadModal = function (hash, url, prefix, params, callback) {
                log.depreciated(
                    "This method is depreciated and will be removed in version 2.0. Please use flash.template.loadModal instead.",
                    "flash.utils.loadModal");

                templating.loadModal(hash, url, prefix, params, callback);
            };

            // #endregion loadModal

            // #region loadPage

            /**
             * Load the page template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The template title used for the document title
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             * OR
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} controller - The prefix used for the controller object
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} title - The template title used for the document title
             *      @param {String} url - The url of the view (html) to load
             */
            self.loadPage = function (hash, url, title, prefix, params, callback) {
                log.depreciated(
                    "This method is depreciated and will be removed in version 2.0. Please use flash.template.loadPage instead.",
                    "flash.utils.loadPage");

                templating.loadPage(hash, url, title, prefix, params, callback);
            };

            // #endregion loadPage

            // #region removeHelpBlock

            /**
             * Remove the help block from the form element specified by the selector
             * @param {String} elementSelector - The selector of the form element
             */
            self.removeHelpBlock = function (elementSelector) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.removeHelpBlock");

                    return;
                }

                $(elementSelector).closest(hasErrorSelector).removeClass(hasErrorClassName);
                $(elementSelector).siblings(helpBlockSelector).not(staticSelector).remove();
            };

            // #endregion removeHelpBlock

            // #region resetForm

            /**
             * Reset the form elements to the default state
             * @param {String} elementSelector - The form selector containing the form elements
             */
            self.resetForm = function (elementSelector) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.resetForm");

                    return;
                }

                for (var i = 0; i < $(elementSelector).length; i++) {
                    $(elementSelector)[i].reset();
                }
            };

            // #endregion resetForm

            // #region resetValidation

            /**
             * Remove all the help blocks from the form specified by the selector
             * @param {String} elementSelector - The form selector containing the form elements
             */
            self.resetValidation = function (elementSelector) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.resetValidation");

                    return;
                }

                $(elementSelector).find(hasErrorSelector).removeClass(hasErrorClassName);
                $(elementSelector).find(helpBlockSelector).not(staticSelector).remove();
            };

            // #endregion resetValidation

            // #region scrollTo

            /**
             * Scroll to the specified location by the parent and target elements
             * @param {Object} $parentElement - The jQuery parent element containing the target element
             * @param {Object} $targetElement - The jQuery target element to scroll to
             * @param {Number} duration - The duration in milliseconds to scroll from current to target
             */
            self.scrollTo = function ($parentElement, $targetElement, duration) {
                if (!$parentElement.length) {
                    $parentElement = flash.$parentElement;
                }

                if (!$targetElement.length) {
                    $targetElement = flash.$templateContainerElement;
                }

                var targetElementPosition = $targetElement.offset(),
                    staticHeaderHeight = application.settings.staticHeaderHeight,
                    // Check if a static header height was supplied, otherwise use the template container element to
                    // calculate top offset
                    topOffset = self.object.isNumber(staticHeaderHeight)
                        ? staticHeaderHeight
                        : flash.$templateContainerElement.length > 0
                            ? flash.$templateContainerElement.offset().top
                            : 0,
                    scrollToPosition = targetElementPosition.top > topOffset ? targetElementPosition.top - topOffset : 0;

                if (self.object.isNumber(duration)) {
                    // Default duration is set to 100 to account for chrome, chrome does not recognize 0
                    $parentElement.animate({
                        scrollTop: scrollToPosition
                    }, duration > 100 ? duration : 100);
                } else {
                    $parentElement.scrollTop(scrollToPosition);
                }
            };

            // #endregion scrollTo

            // #region setDocumentTitle

            /**
             * Set the document title
             * @param {string} pageTitle - The title of the template page that has been loaded
             */
            self.setDocumentTitle = function (pageTitle) {
                log.depreciated(
                    "This method is depreciated and will be removed in version 2.0. Please use flash.template.setDocumentTitle() instead.",
                    "flash.utils.setDocumentTitle");

                templating.setDocumentTitle(pageTitle);
            }

            // #endregion setDocumentTitle

            // #region toggleButton

            /**
             * Toggle the buttons state
             * @param {Object} $button - The jQuery button element to toggle
             */
            self.toggleButton = function ($button) {
                if (self.object.isString($button)) {
                    $button = $($button);
                }

                if ($button.length < 1) {
                    log.error("Button object is null or undefined.", "flash.utils.toggleButton");

                    return;
                }

                var target = $button.attr("target");

                if (target === "_blank") {
                    return;
                }

                var showButtonLoading = application.settings.showButtonLoading,
                    buttonLoadingDisabledClassName = application.settings.buttonLoadingDisabledClassName,
                    buttonLoadingClassName = application.settings.buttonLoadingClassName;

                if (!self.object.isBoolean(showButtonLoading)) {
                    log.error("application.settings.showButtonLoading is not properly set.", "flash.utils.toggleButton");

                    return;
                }

                if (!self.object.isString(buttonLoadingDisabledClassName)) {
                    log.error(
                        "application.settings.buttonLoadingDisabledClassName is not properly set.",
                        "flash.utils.toggleButton");

                    return;
                }

                if (!self.object.isString(buttonLoadingClassName)) {
                    log.error(
                        "application.settings.buttonLoadingClassName is not properly set.",
                        "flash.utils.toggleButton");

                    return;
                }

                if ($button.attr(disabledAttrName)) {
                    $button.attr(disabledAttrName, false);

                    if (showButtonLoading === true &&
                        !$button.hasClass(buttonLoadingDisabledClassName)) {
                        $button.removeClass(buttonLoadingClassName);
                        $button.removeAttr("style");
                    }
                } else {
                    $button.attr(disabledAttrName, true);

                    if (showButtonLoading === true &&
                        !$button.hasClass(buttonLoadingDisabledClassName)) {
                        $button.css({ height: $button.outerHeight(), width: $button.outerWidth() });

                        $button.addClass(buttonLoadingClassName);
                    }
                }
            };

            // #endregion toggleButton

            // #region toggleSubmitButton

            /**
             * Toggle the submit button state
             * @param {String} elementSelector - The form selector containing the submit button
             */
            self.toggleSubmitButton = function (elementSelector) {
                if (!elementSelector) {
                    log.error("Element selector is null or undefined.", "flash.utils.resetValidation");

                    return;
                }

                var $button = $(elementSelector).find("button[type=submit],input[type=submit]").eq(0);

                self.toggleButton($button);
            };

            // #endregion toggleSubmitButton

            // #region object

            /**
             * Add the object data type function checkers
             * @returns {Object} The function object checkers
             */
            self.object = (function () {
                var exports = {},
                    types = [
                    "Array",
                    "Object",
                    "String",
                    "Date",
                    "RegExp",
                    "Function",
                    "Boolean",
                    "Number",
                    "Null",
                    "Undefined"
                    ];

                var getType = function () {
                    return Object.prototype.toString.call(this).slice(8, -1);
                };

                for (var i = types.length - 1; i >= 0; i--) {
                    // Each function starts with the word "is"
                    exports["is" + types[i]] = (function (type) {
                        return function (obj) {
                            return getType.call(obj) === type;
                        }
                    })(types[i]);
                }

                return exports;
            })();

            // #endregion object

            // #region unbind

            /**
             * Add the unbind functions for each event type
             * @returns {Object} The unbind functions
             */
            self.unbind = (function () {
                var exports = {};
                var events = [
                    "blur",
                    "change",
                    "click",
                    "focus",
                    "hover",
                    "keydown",
                    "keypress",
                    "keyup",
                    "mousedown",
                    "mouseenter",
                    "mouseleave",
                    "mousemove",
                    "mouseout",
                    "mouseover",
                    "mouseup",
                    "resize",
                    "scroll",
                    "select",
                    "submit",
                    "toggle"
                ];

                for (var i = events.length - 1; i >= 0; i--) {
                    exports[events[i]] = (function (event) {
                        return function (elementSelector, elementParentSelector) {
                            log.depreciated(
                                "This method is depreciated and will be removed in version 2.0.",
                                "flash.utils.unbind." + event);

                            unbindEvent(event, elementSelector, elementParentSelector);
                        }
                    })(events[i]);
                }

                // A custom event that is not implemented
                exports["event"] = (function () {
                    return function (event, elementSelector, elementParentSelector) {
                        log.depreciated(
                            "This method is depreciated and will be removed in version 2.0.",
                            "flash.utils.unbind." + event);

                        unbindEvent(event, elementSelector, elementParentSelector);
                    }
                })();

                // All events binded to the parent object
                exports["events"] = (function () {
                    return function (elementParentSelector) {
                        log.depreciated(
                            "This method is depreciated and will be removed in version 2.0.",
                            "flash.utils.unbind.events");

                        $(elementParentSelector || document).off();
                    }
                })();

                return exports;
            })();

            // #endregion unbind

            // #endregion Methods

            // #endregion Public

            return self;
        })();

        // #endregion utils

        // #endregion Methods

        // #endregion Public
    }));
})(window, document);

/*!@license Copyright 2013, Heinrich Goebl, License: MIT, see https://github.com/hgoebl/mobile-detect.js*/
!function(a,b){a(function(){"use strict";function a(a,b){return null!=a&&null!=b&&a.toLowerCase()===b.toLowerCase()}function c(a,b){var c,d,e=a.length;if(!e||!b)return!1;for(c=b.toLowerCase(),d=0;d<e;++d)if(c===a[d].toLowerCase())return!0;return!1}function d(a){for(var b in a)i.call(a,b)&&(a[b]=new RegExp(a[b],"i"))}function e(a){return(a||"").substr(0,500)}function f(a,b){this.ua=e(a),this._cache={},this.maxPhoneWidth=b||600}var g={};g.mobileDetectRules={phones:{iPhone:"\\biPhone\\b|\\biPod\\b",BlackBerry:"BlackBerry|\\bBB10\\b|rim[0-9]+",HTC:"HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",Nexus:"Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",Dell:"Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",Motorola:"Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092",Samsung:"\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F",LG:"\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323)",Sony:"SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",Asus:"Asus.*Galaxy|PadFone.*Mobile",NokiaLumia:"Lumia [0-9]{3,4}",Micromax:"Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",Palm:"PalmSource|Palm",Vertu:"Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",Pantech:"PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",Fly:"IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",Wiko:"KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",iMobile:"i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",SimValley:"\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",Wolfgang:"AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",Alcatel:"Alcatel",Nintendo:"Nintendo 3DS",Amoi:"Amoi",INQ:"INQ",GenericPhone:"Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"},tablets:{iPad:"iPad|iPad.*Mobile",NexusTablet:"Android.*Nexus[\\s]+(7|9|10)",SamsungTablet:"SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y",Kindle:"Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk/[0-9.]+ like Chrome/[0-9.]+ (?!Mobile)",SurfaceTablet:"Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",HPTablet:"HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",AsusTablet:"^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b",BlackBerryTablet:"PlayBook|RIM Tablet",HTCtablet:"HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",MotorolaTablet:"xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",NookTablet:"Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",AcerTablet:"Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",ToshibaTablet:"Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",LGTablet:"\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",FujitsuTablet:"Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",PrestigioTablet:"PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",LenovoTablet:"Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304F|TB-8703F",DellTablet:"Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",YarvikTablet:"Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",MedionTablet:"Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",ArnovaTablet:"97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",IntensoTablet:"INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",IRUTablet:"M702pro",MegafonTablet:"MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",EbodaTablet:"E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",AllViewTablet:"Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",ArchosTablet:"\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",AinolTablet:"NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",NokiaLumiaTablet:"Lumia 2520",SonyTablet:"Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",PhilipsTablet:"\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",CubeTablet:"Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",CobyTablet:"MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",MIDTablet:"M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",MSITablet:"MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",SMiTTablet:"Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",RockChipTablet:"Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",FlyTablet:"IQ310|Fly Vision",bqTablet:"Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))|Maxwell.*Lite|Maxwell.*Plus",HuaweiTablet:"MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L",NecTablet:"\\bN-06D|\\bN-08D",PantechTablet:"Pantech.*P4100",BronchoTablet:"Broncho.*(N701|N708|N802|a710)",VersusTablet:"TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",ZyncTablet:"z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",PositivoTablet:"TB07STA|TB10STA|TB07FTA|TB10FTA",NabiTablet:"Android.*\\bNabi",KoboTablet:"Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",DanewTablet:"DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",TexetTablet:"NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",PlaystationTablet:"Playstation.*(Portable|Vita)",TrekstorTablet:"ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",PyleAudioTablet:"\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",AdvanTablet:"Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",DanyTechTablet:"Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",GalapadTablet:"Android.*\\bG1\\b",MicromaxTablet:"Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",KarbonnTablet:"Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",AllFineTablet:"Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",PROSCANTablet:"\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",YONESTablet:"BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",ChangJiaTablet:"TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",GUTablet:"TX-A1301|TX-M9002|Q702|kf026",PointOfViewTablet:"TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",OvermaxTablet:"OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",HCLTablet:"HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",DPSTablet:"DPS Dream 9|DPS Dual 7",VistureTablet:"V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",CrestaTablet:"CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",MediatekTablet:"\\bMT8125|MT8389|MT8135|MT8377\\b",ConcordeTablet:"Concorde([ ]+)?Tab|ConCorde ReadMan",GoCleverTablet:"GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",ModecomTablet:"FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",VoninoTablet:"\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",ECSTablet:"V07OT2|TM105A|S10OT1|TR10CS1",StorexTablet:"eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",VodafoneTablet:"SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497",EssentielBTablet:"Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",RossMoorTablet:"RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",iMobileTablet:"i-mobile i-note",TolinoTablet:"tolino tab [0-9.]+|tolino shine",AudioSonicTablet:"\\bC-22Q|T7-QC|T-17B|T-17P\\b",AMPETablet:"Android.* A78 ",SkkTablet:"Android.* (SKYPAD|PHOENIX|CYCLOPS)",TecnoTablet:"TECNO P9",JXDTablet:"Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",iJoyTablet:"Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",FX2Tablet:"FX2 PAD7|FX2 PAD10",XoroTablet:"KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",ViewsonicTablet:"ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",VerizonTablet:"QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",OdysTablet:"LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",CaptivaTablet:"CAPTIVA PAD",IconbitTablet:"NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",TeclastTablet:"T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",OndaTablet:"\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",JaytechTablet:"TPC-PA762",BlaupunktTablet:"Endeavour 800NG|Endeavour 1010",DigmaTablet:"\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",EvolioTablet:"ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",LavaTablet:"QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",AocTablet:"MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",MpmanTablet:"MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",CelkonTablet:"CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",WolderTablet:"miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",MiTablet:"\\bMI PAD\\b|\\bHM NOTE 1W\\b",NibiruTablet:"Nibiru M1|Nibiru Jupiter One",NexoTablet:"NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",LeaderTablet:"TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",UbislateTablet:"UbiSlate[\\s]?7C",PocketBookTablet:"Pocketbook",KocasoTablet:"\\b(TB-1207)\\b",HisenseTablet:"\\b(F5281|E2371)\\b",Hudl:"Hudl HT7S3|Hudl 2",TelstraTablet:"T-Hub2",GenericTablet:"Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b"},oss:{AndroidOS:"Android",BlackBerryOS:"blackberry|\\bBB10\\b|rim tablet os",PalmOS:"PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",SymbianOS:"Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",WindowsMobileOS:"Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",WindowsPhoneOS:"Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",iOS:"\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",MeeGoOS:"MeeGo",MaemoOS:"Maemo",JavaOS:"J2ME/|\\bMIDP\\b|\\bCLDC\\b",webOS:"webOS|hpwOS",badaOS:"\\bBada\\b",BREWOS:"BREW"},uas:{Chrome:"\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",Dolfin:"\\bDolfin\\b",Opera:"Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",Skyfire:"Skyfire",Edge:"Mobile Safari/[.0-9]* Edge",IE:"IEMobile|MSIEMobile",Firefox:"fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",Bolt:"bolt",TeaShark:"teashark",Blazer:"Blazer",Safari:"Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",UCBrowser:"UC.*Browser|UCWEB",baiduboxapp:"baiduboxapp",baidubrowser:"baidubrowser",DiigoBrowser:"DiigoBrowser",Puffin:"Puffin",Mercury:"\\bMercury\\b",ObigoBrowser:"Obigo",NetFront:"NF-Browser",GenericBrowser:"NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",PaleMoon:"Android.*PaleMoon|Mobile.*PaleMoon"},props:{Mobile:"Mobile/[VER]",Build:"Build/[VER]",Version:"Version/[VER]",VendorID:"VendorID/[VER]",iPad:"iPad.*CPU[a-z ]+[VER]",iPhone:"iPhone.*CPU[a-z ]+[VER]",iPod:"iPod.*CPU[a-z ]+[VER]",Kindle:"Kindle/[VER]",Chrome:["Chrome/[VER]","CriOS/[VER]","CrMo/[VER]"],Coast:["Coast/[VER]"],Dolfin:"Dolfin/[VER]",Firefox:["Firefox/[VER]","FxiOS/[VER]"],Fennec:"Fennec/[VER]",Edge:"Edge/[VER]",IE:["IEMobile/[VER];","IEMobile [VER]","MSIE [VER];","Trident/[0-9.]+;.*rv:[VER]"],NetFront:"NetFront/[VER]",NokiaBrowser:"NokiaBrowser/[VER]",Opera:[" OPR/[VER]","Opera Mini/[VER]","Version/[VER]"],"Opera Mini":"Opera Mini/[VER]","Opera Mobi":"Version/[VER]",UCBrowser:["UCWEB[VER]","UC.*Browser/[VER]"],MQQBrowser:"MQQBrowser/[VER]",MicroMessenger:"MicroMessenger/[VER]",baiduboxapp:"baiduboxapp/[VER]",baidubrowser:"baidubrowser/[VER]",SamsungBrowser:"SamsungBrowser/[VER]",Iron:"Iron/[VER]",Safari:["Version/[VER]","Safari/[VER]"],Skyfire:"Skyfire/[VER]",Tizen:"Tizen/[VER]",Webkit:"webkit[ /][VER]",PaleMoon:"PaleMoon/[VER]",Gecko:"Gecko/[VER]",Trident:"Trident/[VER]",Presto:"Presto/[VER]",Goanna:"Goanna/[VER]",iOS:" \\bi?OS\\b [VER][ ;]{1}",Android:"Android [VER]",BlackBerry:["BlackBerry[\\w]+/[VER]","BlackBerry.*Version/[VER]","Version/[VER]"],BREW:"BREW [VER]",Java:"Java/[VER]","Windows Phone OS":["Windows Phone OS [VER]","Windows Phone [VER]"],"Windows Phone":"Windows Phone [VER]","Windows CE":"Windows CE/[VER]","Windows NT":"Windows NT [VER]",Symbian:["SymbianOS/[VER]","Symbian/[VER]"],webOS:["webOS/[VER]","hpwOS/[VER];"]},utils:{Bot:"Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",MobileBot:"Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",DesktopMode:"WPDesktop",TV:"SonyDTV|HbbTV",WebKit:"(webkit)[ /]([\\w.]+)",Console:"\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|PLAYSTATION|Xbox)\\b",Watch:"SM-V700"}},g.detectMobileBrowsers={fullPattern:/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,shortPattern:/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,tabletPattern:/android|ipad|playbook|silk/i};var h,i=Object.prototype.hasOwnProperty;return g.FALLBACK_PHONE="UnknownPhone",g.FALLBACK_TABLET="UnknownTablet",g.FALLBACK_MOBILE="UnknownMobile",h="isArray"in Array?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},function(){var a,b,c,e,f,j,k=g.mobileDetectRules;for(a in k.props)if(i.call(k.props,a)){for(b=k.props[a],h(b)||(b=[b]),f=b.length,e=0;e<f;++e)c=b[e],j=c.indexOf("[VER]"),j>=0&&(c=c.substring(0,j)+"([\\w._\\+]+)"+c.substring(j+5)),b[e]=new RegExp(c,"i");k.props[a]=b}d(k.oss),d(k.phones),d(k.tablets),d(k.uas),d(k.utils),k.oss0={WindowsPhoneOS:k.oss.WindowsPhoneOS,WindowsMobileOS:k.oss.WindowsMobileOS}}(),g.findMatch=function(a,b){for(var c in a)if(i.call(a,c)&&a[c].test(b))return c;return null},g.findMatches=function(a,b){var c=[];for(var d in a)i.call(a,d)&&a[d].test(b)&&c.push(d);return c},g.getVersionStr=function(a,b){var c,d,e,f,h=g.mobileDetectRules.props;if(i.call(h,a))for(c=h[a],e=c.length,d=0;d<e;++d)if(f=c[d].exec(b),null!==f)return f[1];return null},g.getVersion=function(a,b){var c=g.getVersionStr(a,b);return c?g.prepareVersionNo(c):NaN},g.prepareVersionNo=function(a){var b;return b=a.split(/[a-z._ \/\-]/i),1===b.length&&(a=b[0]),b.length>1&&(a=b[0]+".",b.shift(),a+=b.join("")),Number(a)},g.isMobileFallback=function(a){return g.detectMobileBrowsers.fullPattern.test(a)||g.detectMobileBrowsers.shortPattern.test(a.substr(0,4))},g.isTabletFallback=function(a){return g.detectMobileBrowsers.tabletPattern.test(a)},g.prepareDetectionCache=function(a,c,d){if(a.mobile===b){var e,h,i;return(h=g.findMatch(g.mobileDetectRules.tablets,c))?(a.mobile=a.tablet=h,void(a.phone=null)):(e=g.findMatch(g.mobileDetectRules.phones,c))?(a.mobile=a.phone=e,void(a.tablet=null)):void(g.isMobileFallback(c)?(i=f.isPhoneSized(d),i===b?(a.mobile=g.FALLBACK_MOBILE,a.tablet=a.phone=null):i?(a.mobile=a.phone=g.FALLBACK_PHONE,a.tablet=null):(a.mobile=a.tablet=g.FALLBACK_TABLET,a.phone=null)):g.isTabletFallback(c)?(a.mobile=a.tablet=g.FALLBACK_TABLET,a.phone=null):a.mobile=a.tablet=a.phone=null)}},g.mobileGrade=function(a){var b=null!==a.mobile();return a.os("iOS")&&a.version("iPad")>=4.3||a.os("iOS")&&a.version("iPhone")>=3.1||a.os("iOS")&&a.version("iPod")>=3.1||a.version("Android")>2.1&&a.is("Webkit")||a.version("Windows Phone OS")>=7||a.is("BlackBerry")&&a.version("BlackBerry")>=6||a.match("Playbook.*Tablet")||a.version("webOS")>=1.4&&a.match("Palm|Pre|Pixi")||a.match("hp.*TouchPad")||a.is("Firefox")&&a.version("Firefox")>=12||a.is("Chrome")&&a.is("AndroidOS")&&a.version("Android")>=4||a.is("Skyfire")&&a.version("Skyfire")>=4.1&&a.is("AndroidOS")&&a.version("Android")>=2.3||a.is("Opera")&&a.version("Opera Mobi")>11&&a.is("AndroidOS")||a.is("MeeGoOS")||a.is("Tizen")||a.is("Dolfin")&&a.version("Bada")>=2||(a.is("UC Browser")||a.is("Dolfin"))&&a.version("Android")>=2.3||a.match("Kindle Fire")||a.is("Kindle")&&a.version("Kindle")>=3||a.is("AndroidOS")&&a.is("NookTablet")||a.version("Chrome")>=11&&!b||a.version("Safari")>=5&&!b||a.version("Firefox")>=4&&!b||a.version("MSIE")>=7&&!b||a.version("Opera")>=10&&!b?"A":a.os("iOS")&&a.version("iPad")<4.3||a.os("iOS")&&a.version("iPhone")<3.1||a.os("iOS")&&a.version("iPod")<3.1||a.is("Blackberry")&&a.version("BlackBerry")>=5&&a.version("BlackBerry")<6||a.version("Opera Mini")>=5&&a.version("Opera Mini")<=6.5&&(a.version("Android")>=2.3||a.is("iOS"))||a.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3")||a.version("Opera Mobi")>=11&&a.is("SymbianOS")?"B":(a.version("BlackBerry")<5||a.match("MSIEMobile|Windows CE.*Mobile")||a.version("Windows Mobile")<=5.2,"C")},g.detectOS=function(a){return g.findMatch(g.mobileDetectRules.oss0,a)||g.findMatch(g.mobileDetectRules.oss,a)},g.getDeviceSmallerSide=function(){return window.screen.width<window.screen.height?window.screen.width:window.screen.height},f.prototype={constructor:f,mobile:function(){return g.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.mobile},phone:function(){return g.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.phone},tablet:function(){return g.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.tablet},userAgent:function(){return this._cache.userAgent===b&&(this._cache.userAgent=g.findMatch(g.mobileDetectRules.uas,this.ua)),this._cache.userAgent},userAgents:function(){return this._cache.userAgents===b&&(this._cache.userAgents=g.findMatches(g.mobileDetectRules.uas,this.ua)),this._cache.userAgents},os:function(){return this._cache.os===b&&(this._cache.os=g.detectOS(this.ua)),this._cache.os},version:function(a){return g.getVersion(a,this.ua)},versionStr:function(a){return g.getVersionStr(a,this.ua)},is:function(b){return c(this.userAgents(),b)||a(b,this.os())||a(b,this.phone())||a(b,this.tablet())||c(g.findMatches(g.mobileDetectRules.utils,this.ua),b)},match:function(a){return a instanceof RegExp||(a=new RegExp(a,"i")),a.test(this.ua)},isPhoneSized:function(a){return f.isPhoneSized(a||this.maxPhoneWidth)},mobileGrade:function(){return this._cache.grade===b&&(this._cache.grade=g.mobileGrade(this)),this._cache.grade}},"undefined"!=typeof window&&window.screen?f.isPhoneSized=function(a){return a<0?b:g.getDeviceSmallerSide()<=a}:f.isPhoneSized=function(){},f._impl=g,f.version="1.4.1 2017-12-24",f})}(function(a){if("undefined"!=typeof module&&module.exports)return function(a){module.exports=a()};if("function"==typeof define&&define.amd)return define;if("undefined"!=typeof window)return function(a){window.MobileDetect=a()};throw new Error("unknown environment")}());