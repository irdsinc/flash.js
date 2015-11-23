/*!
 * Flash JavaScript Library v1.1.0 (http://flashjs.org)
 * Copyright 2015 IRDS, Inc.
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

; (function (window, document) {
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
                        DEFAULT: "An unknown error occured. Please try again.",
                        FORBIDDEN: "You do not have permission to view this directory or page.",
                        NOTFOUND: "The page cannot be found.",
                        UNAUTHORIZED: "Your session has expired. Please <a href=\"{0}\">Sign In</a> to continue."
                    }
                },
                settings: {
                    afterLoad: function () { },
                    afterUnload: function () { },
                    alertModalTargetElementSelector: ".modal-body",
                    alertPageTargetElementSelector: "body > #content > .container",
                    baseRootPath: "/",
                    beforeLoad: function () { },
                    beforeUnload: function () { },
                    buttonLoadingClassName: "btn-loading",
                    buttonLoadingDisabledClassName: "btn-loading-disabled",
                    caseSensitiveRoutes: false,
                    disableSpanInLabelDefaultAction: true,
                    documentParentElementSelector: "html, body",
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

            // #region Match

            /**
             * The Match object constructor
             * @param {Boolean} success - Did the regex match
             * @param {String} hash - The matching hash
             * @param {Object} params - The object containing the named parameters
             */
            self.Match = function (success, hash, params) {
                this.success = success;
                this.hash = hash;
                this.params = params;
            };

            // #endregion Match

            // #region Route

            /**
             * The Route object constructor
             * @param {String} hash - The unique identifier of the route
             * @param {Object} params - The object containing the parameters
             */
            self.Route = function (hash, params) {
                this.hash = hash;
                this.params = params;
            };

            // #endregion Route

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
             *      @param {String} title - The template title used for the document title
             *      @param {Number} type - The template type
             */
            self.Template = function (config) {
                this.callback = config.callback;
                this.containerElementSelector = config.containerElementSelector;
                this.controller = buildControllerName(config.prefix);
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
                    $(window).bind("hashchange", method);
                }
            };

            // #endregion bind

            // #endregion Methods

            // #endregion Public

            return self;
        })(),

        // #endregion hashchange

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

            // #region buttonSelector

                buttonSelector = "button[disabled=disabled],\
                    input[type=submit][disabled=disabled],\
                    input[type=button][disabled=disabled],\
                    input[type=reset][disabled=disabled],\
                    a.btn[disabled=disabled]",

            // #endregion buttonSelector

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
             */
            function runAfterLoad(type, params) {
                if (flash.utils.object.isFunction(application.settings.afterLoad)) {
                    application.settings.afterLoad(type, params);
                }

                // Send google analytics page view data
                tracking.sendGoogleAnalyticsPageView();

                // Enable all disabled buttons in the current template
                flash.$parentElement.find(buttonSelector).attr("disabled", false);

                // Bind click event to any link to allow for reloading page if the href is the current hash
                $("a").unbind("click").bind("click", function () {
                    if (window.location.hash != "" && $(this).attr("href") === flash.utils.buildUrl(window.location.hash)) {
                        routing.redirect(window.location.hash);
                    }
                });

                // Bind click event to any link buttons to allow for toggling and loading animation
                flash.$parentElement.find("a.btn").click(function () {
                    var $button = $(this);

                    flash.utils.toggleButton($button);
                });

                // Bind click event to labels containing span elements to disable default selection of checkbox, if
                // checkbox is present
                if (application.settings.disableSpanInLabelDefaultAction) {
                    flash.$parentElement.find("label").has("span").click(function (e) {
                        if (e.target.nodeName === "SPAN") {
                            e.preventDefault();
                        }
                    });
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
                // Hide mobile nav after page unload
                var $nav = $(".navbar-collapse");

                if ($nav.hasClass("in")) {
                    $nav.removeClass("in");
                    $nav.attr("aria-expanded", false);
                    $nav.height(1);
                }

                if (flash.utils.object.isFunction(application.settings.afterUnload)) {
                    application.settings.afterUnload(type, params);
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
             */
            function display(template, preparedHtml, params, callback) {
                var $templateContainerElement = $(template.containerElementSelector);

                // Set the view to the prepared HTML string
                $templateContainerElement.html(preparedHtml);

                if (flash.utils.object.isFunction(callback)) {
                    callback();
                }

                var $parentElement = template.type === self.types.PAGE
                    ? $(application.settings.documentParentElementSelector)
                    : flash.$parentElement;

                flash.utils.scrollTo($parentElement, $templateContainerElement);

                if (flash.utils.object.isFunction(template.callback)) {
                    template.callback(true);
                }

                runAfterLoad(template.type, params);
            }

            // #endregion display

            // #region displayModal

            /**
             * Inject the modal template into the DOM and bind shown/hidden modal events
             * @param {Object} template - The template object
             * @param {String} preparedHtml - The HTML string of the template to load
             * @param {Object} params - The object containing the parameters
             */
            function displayModal(template, preparedHtml, params) {
                var $modal = $(preparedHtml);

                // Hide the modal when a hashchange event fires
                hashchange.bind(function () {
                    $modal.modal("hide");

                    // When modal lives inside #content container, modal elements are not properly updated on hide event,
                    // due to missing reference when HTML is replaced inside #content container
                    $("body").removeClass("modal-open");
                    $(".modal-backdrop").remove();
                });

                /*$modal.on(application.settings.modalShowEventName, function () {
                });*/

                $modal.on(application.settings.modalShownEventName, function () {
                    if (flash.utils.object.isFunction(template.callback)) {
                        template.callback(true);
                    }

                    runAfterLoad(template.type);

                    // TODO: not sure if this is still required, need to check
                    //$(".modal-dialog").resize(function () { });
                });

                $modal.on(application.settings.modalHideEventName, function () {
                    self.hidePageLoading();

                    if (flash.utils.object.isFunction(application.settings.beforeUnload)) {
                        application.settings.beforeUnload(template.type, params);
                    }
                });

                $modal.on(application.settings.modalHiddenEventName, function () {
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
                        .off(application.settings.modalShowEventName)
                        .off(application.settings.modalShownEventName)
                        .off(application.settings.modalHideEventName)
                        .off(application.settings.modalHiddenEventName);

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

            // #region load

            /**
             * Load the template for the supplied hash from client browser session or request new template
             * @param {Object} config - The object containing the template config settings
             *      @param {Function} callback - The function that is executed when the template is loaded
             *      @param {String} containerElementSelector - The container element selector used to prepend the template to
             *      @param {String} hash - The unique identifier of the template
             *      @param {Object} params - The object containing the parameters
             *      @param {String} prefix - The prefix used for the controller and tab objects
             *      @param {String} title - The template title used for the document title
             *      @param {Number} type - The template type
             *      @param {String} url - The url of the view (html) to load
             */
            function load(config) {
                if (!flash.utils.object.isObject(config) ||
                    !flash.utils.object.isNumber(config.type) ||
                    !flash.utils.object.isString(config.hash) ||
                    !flash.utils.object.isString(config.url) ||
                    (!flash.utils.object.isString(config.containerElementSelector) &&
                    (config.type == self.types.PAGE || config.type == self.types.PARTIAL))) {
                    return;
                }

                var template = get(config.hash);

                if (template) {
                    template.init(config.params);
                } else {
                    template = new object.Template(config);

                    template.request(config.url, config.params);
                }
            }

            // #endregion load

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Objects

            // #region types

            self.types = { PAGE: 0, MODAL: 1, PARTIAL: 2 };

            // #endregion types

            // #endregion Objects

            // #region Methods

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
                // Check to make sure to page loading is active
                if (!application.settings.showPageLoading) {
                    return;
                }

                var $pageLoading = $("." + application.settings.pageLoadingClassName);

                if ($pageLoading.length) {
                    $pageLoading.show();

                    return;
                }

                var $body = $("body"),
                    $div = $("<div/>", {
                        "class": application.settings.pageLoadingClassName
                    });

                $("<span/>").text("Loading...").appendTo($div);

                // Add the page loading element to the body element
                $body.prepend($div);
            };

            // #endregion displayPageLoading

            // #region hidePageLoading

            /**
             * Hide the page loading element from the view
             */
            self.hidePageLoading = function () {
                // Check to make sure to page loading is active
                if (!application.settings.showPageLoading) {
                    return;
                }

                var $pageLoading = $("." + application.settings.pageLoadingClassName);

                // Hide the page loading element if it exists
                if ($pageLoading.length) {
                    $pageLoading.hide();
                }
            };

            // #endregion hidePageLoading

            // #region loadModal

            /**
             * Load the modal template
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} prefix - The prefix used for the controller and tab objects
             * @param {Object} params - The object containing the parameters
             * @param {Function} callback - The function that is executed when the template is loaded
             */
            self.loadModal = function (hash, url, prefix, params, callback) {
                self.displayPageLoading();

                var config = {
                    callback: callback,
                    hash: hash,
                    params: params,
                    prefix: prefix,
                    type: self.types.MODAL,
                    url: url
                };

                load(config);
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
             */
            self.loadPage = function (hash, url, title, prefix, params, callback) {
                var config = {
                    callback: callback,
                    containerElementSelector: application.settings.templateContainerElementSelector,
                    hash: hash,
                    params: params,
                    prefix: prefix,
                    title: title,
                    type: self.types.PAGE,
                    url: url
                };

                load(config);
            };

            // #endregion loadPage

            // #region loadPartial

            /**
             * Load the partial templatetemplate
             * @param {String} hash - The unique identifier of the template
             * @param {String} url - The url of the view (html) to load
             * @param {String} containerElementSelector - The container element selector used to prepend the template to
             * @param {Function} callback - The function that is executed when the template is loaded
             */
            self.loadPartial = function (hash, url, containerElementSelector, callback) {
                var config = {
                    callback: callback,
                    containerElementSelector: containerElementSelector,
                    hash: hash,
                    type: self.types.PARTIAL,
                    url: url
                };

                load(config);
            };

            // #endregion loadPartial

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
                document.title = pageTitle
                    ? pageTitle + (application.title ? " | " + application.title : "")
                    : application.title;
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
                    return;
                }

                self.displayPageLoading();

                // Check if pre-defined before unload function is still a function and run it in case it was overloaded by user
                if (flash.utils.object.isFunction(application.settings.beforeUnload)) {
                    application.settings.beforeUnload(template.type, params);
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
             */
            object.Template.prototype.display = function (preparedHtml, params) {
                var template = this;

                if (flash.utils.object.isFunction(application.settings.beforeLoad)) {
                    application.settings.beforeLoad(template.type, preparedHtml, params);
                }

                if (template.type === self.types.MODAL) {
                    displayModal(template, preparedHtml, params);
                } else {
                    display(template, preparedHtml, params, template.type === self.types.PARTIAL ? null : function () {
                        self.setDocumentTitle(template.title);
                        self.setActiveTab(template.tab);
                    });
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
                        callback = function () {
                            template.display($templateHtml.html(), params);
                        };

                    window[template.controller].init(callback, params, $templateHtml);
                } else {
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
                if ($element.is("script")) {
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
                    elementsToLoad = "script[src],img[src]";

                if ($html.find(elementsToLoad).length > 0) {
                    var elementLoadCounter = $html.find(elementsToLoad).length;

                    $html.find(elementsToLoad).each(function () {
                        var $element = $(this),
                            src = $element.attr("src");

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
                // Only load google analytics if tracking code was supplied
                if (!flash.utils.object.isString(application.settings.googleAnalyticsTrackingCode)) {
                    return;
                }

                (function (i, s, o, g, r, a, m) {
                    i["GoogleAnalyticsObject"] = r; i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }, i[r].l = 1 * new Date(); a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
                })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");

                ga("create", application.settings.googleAnalyticsTrackingCode, "auto");
            };

            // #endregion loadGoogleAnalytics

            // #region sendGoogleAnalyticsPageView

            /**
             * Send google analytics page view data
             */
            self.sendGoogleAnalyticsPageView = function () {
                // Only send google analytics page view data if tracking code was supplied
                if (!flash.utils.object.isString(application.settings.googleAnalyticsTrackingCode)) {
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

            // #region escapedRegexQueryIdentifier

                escapedRegexQueryIdentifier = "\\?",

            // #endregion escapedRegexQueryIdentifier

            // #region hashPrefix

                hashPrefix = "#/",

            // #endregion hashPrefix

            // #region namedParameterIdentifier

                namedParameterIdentifier = "{",

            // #endregion namedParameterIdentifier

            // #region onLoads

                onLoads = {},

            // #endregion onLoads

            // #region onUnloads

                onUnloads = {},

            // #endregion onUnloads

            // #region previousRouteHash

                previousRouteHash = null,

            // #endregion previousRouteHash

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

            // #region regexRoutes

                regexRoutes = [],

            // #endregion regexRoutes

            // #region regexStartAnchor

                regexStartAnchor = "^",

            // #endregion regexStartAnchor

            // #region reloadRequested

                reloadRequested = false,

            // #endregion reloadRequested

            // #region routePathDivider

                routePathDivider = "/";

            // #endregion routePathDivider

            // #endregion Objects

            // #region Methods

            // #region addOnLoad

            /**
             * Add the load method to the client browser session for the specified unique hash
             * @param {String} hash - The unique identifier of the template
             * @param {String} routeHash - The requested route hash
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The template title used for the document title
             * @param {String} prefix - The prefix used for the controller and tab objects
             */
            function addOnLoad(hash, routeHash, url, title, prefix) {
                onLoads[hash] = function (params, callback) {
                    templating.loadPage(routeHash, url, title, prefix, params, callback);
                };
            }

            // #endregion addOnLoad

            // #region addOnUnload

            /**
             * Add the unload method to the client browser session for the specified unique hash
             * @param {String} hash - The unique identifier of the template
             * @param {String} routeHash - The requested route hash
             */
            function addOnUnload(hash, routeHash) {
                onUnloads[hash] = function (params) {
                    templating.unload(routeHash, params);
                };
            }

            // #endregion addOnUnload

            // #region addRegexRoute

            /**
             * Add the regex route to the browser session
             * @param {String} hash - The unique identifier of the template
             * @param {Object} params - The object containing the parameters
             * @returns {String} The updated hash with regex match strings
             */
            function addRegexRoute(hash, params) {
                hash = regexStartAnchor + hash.replace(regexQueryIdentifier, escapedRegexQueryIdentifier);

                // If hash containes non named parameters
                if (hash.indexOf(regexNonNamedParameterString) >= 0) {
                    hash = hash.replace(regexNonNamedParameters, regexParametersMatchString);

                    regexRoutes.push(new object.Route(hash));
                    // Else the hash contains named parameters
                } else {
                    hash = hash.replace(regexNamedParameters, regexParametersMatchString);

                    regexRoutes.push(new object.Route(hash, params));
                }

                return hash;
            }

            // #endregion addRegexRoute

            // #region getRoute

            /**
             * Get the route object containing the unique hash and named params
             * @param {String} hash - The unique identifier of the template
             * @returns {Object} The route object
             */
            function getRoute(hash) {
                // Get the params by name and update the hash if named parameters are present in the querystring
                if (hash.indexOf(regexNonNamedParameterString) < 0) {
                    var params = hash.match(regexNamedParameters),
                        hasQueryString = hash.indexOf(queryIdentifier) >= 0;

                    if (!params) {
                        return new object.Route(hash);
                    }

                    for (var i = 0; i < params.length; i++) {
                        var param = params[i],
                            paramName = param.slice(1, -1);

                        if (hasQueryString) {
                            var queryStringParam = paramName + queryStringNameValueSeparator + param;

                            // Add the name value pair string (name=value) to the hash
                            hash = hash.replace(param, queryStringParam);
                        }

                        params[i] = paramName;
                    }

                    return new object.Route(hash, params);
                }

                return new object.Route(hash);
            }

            // #endregion getRoute

            // #region regexMatch

            /**
             * Match the requested route hash with an existing unique regex hash
             * @param {String} routeHash - The requested route hash
             * @returns {Object} The match object
             */
            function regexMatch(routeHash) {
                for (var i = regexRoutes.length - 1; i >= 0; i--) {
                    var route = regexRoutes[i],
                        regExp = new RegExp(route.hash);

                    if (!regExp.test(routeHash)) {
                        continue;
                    }

                    var map,
                        params = routeHash.match(regExp);

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

                    return new object.Match(true, route.hash, map || params);
                }

                return new object.Match(false);
            }

            // #endregion regexMatch

            // #region runOnLoad

            /**
             * Execute the load method for the requested route hash
             * @param {String} routeHash - The requested route hash
             * @param {String} routeHashLower - The requested route hash in lower case form
             */
            function runOnLoad(routeHash, routeHashLower) {
                var onLoad = onLoads[routeHash],
                    onLoadLower = onLoads[routeHashLower];

                // Try to execute the non altered request hash load method
                if (onLoad) {
                    onLoad(null, function () {
                        previousRouteHash = routeHash;
                    });
                    // Try to execute the lower cased request hash load method
                } else if (onLoadLower) {
                    onLoadLower(null, function () {
                        previousRouteHash = routeHashLower;
                    });
                    // Try to execute the regex request hash load method
                } else {
                    var match = regexMatch(routeHash);

                    // Non altered regex request hash
                    if (match.success === true) {
                        onLoads[match.hash](match.params, function () {
                            previousRouteHash = routeHash;
                        });
                        // Lower cased regex request hash
                    } else {
                        var matchLower = regexMatch(routeHashLower);

                        if (matchLower.success === true) {
                            onLoads[matchLower.hash](matchLower.params, function () {
                                previousRouteHash = routeHashLower;
                            });
                        } else {
                            flash.utils.displayErrorPage(flash.http.statusCodes.NOTFOUND);
                        }
                    }
                }
            }

            // #endregion runOnLoad

            // #region runOnUnload

            /**
             * Execute the unload method for the previously requested route hash
             * @param {String} routeHash - The previously requested route hash
             */
            function runOnUnload(routeHash) {
                var onUnload = onUnloads[routeHash];

                // Try to execute request hash unload method
                if (onUnload) {
                    onUnload();
                    // Try to execute the regex request hash unload method
                } else {
                    var match = regexMatch(routeHash);

                    if (match.success) {
                        onUnloads[match.hash](match.params);
                    }
                }
            }

            // #endregion runOnUnload

            // #region toLowerCase

            /**
             * Lower case the route hash, not incuding the querystring if it exists
             * @param {String} routeHash - The route hash unique identifier
             * @returns {String} The route hash in lower case
             */
            function toLowerCase(routeHash) {
                if (!routeHash) {
                    return null;
                }

                if (application.settings.caseSensitiveRoutes) {
                    return routeHash;
                }

                var queryIdentifierIndex = routeHash.indexOf(queryIdentifier),
                    path = queryIdentifierIndex >= 0 ? routeHash.substr(0, queryIdentifierIndex) : routeHash,
                    queryString = queryIdentifierIndex >= 0 ? routeHash.substr(queryIdentifierIndex) : "",
                    routeParts = path.split(routePathDivider);

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

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Methods

            // #region addRoute

            /**
             * Add route definition
             * @param {String} path - The route identifier, must be unique
             * @param {String} url - The url of the view (html) to load
             * @param {String} title - The title of page
             * @param {String} prefix - The prefix for the controller and tab
             * @param {Boolean} regex - Does the route contain parameters
             * @param {Boolean} caseSensitive - Is the route case sensitive
             */
            self.addRoute = function (path, url, title, prefix, regex, caseSensitive) {
                var builtHash = self.buildHash(path);

                if (!builtHash) {
                    return;
                }

                // Assign the appropriate hash, depending on route case sensitivity
                var hash = caseSensitive ? builtHash : toLowerCase(builtHash),
                    routeHash = hash;

                // Handle the route if it is a regex
                if (regex) {
                    var route = getRoute(hash);

                    routeHash = route.hash;

                    hash = addRegexRoute(route.hash, route.params);
                }

                addOnLoad(hash, routeHash, url, title, prefix);
                addOnUnload(hash, routeHash);
            };

            // #endregion addRoute

            // #region buildHash

            /**
             * Build the hash to ensure a hashtag/slash prefix
             * @param {String} path - The route identifier, must be unique
             * @returns {String} The updated hash containing the hashtag/slash prefix
             */
            self.buildHash = function (path) {
                // Ensure the path is a string
                if (flash.utils.object.isString(path)) {
                    // Return the path if the hashtag/slash prefix exists
                    if (path.indexOf(hashPrefix) === 0) {
                        return path;
                    }

                    var hashtag = "#",
                        hashtagIndex = path.indexOf(hashtag),
                        slashIndex = path.indexOf("/");

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
                }

                return null;
            };

            // #endregion buildHash

            // #region getUnauthorizedRedirectPath

            /**
             * Method to get the unauthorized redirect path
             * @returns {String} The unauthorized redirect path including return url, when applicable
             */
            self.getUnauthorizedRedirectPath = function () {
                var returnUrl = encodeURIComponent(window.location.href),
                    unauthorizedRedirectPath = application.settings.unauthorizedRedirectPath;

                // Only attach the return URL if current page is not an error page
                if (returnUrl.indexOf("error") < 0) {
                    var returnUrlParameter = "?returnUrl=";

                    unauthorizedRedirectPath += returnUrlParameter + returnUrl;
                }

                return unauthorizedRedirectPath;
            };

            // #endregion getUnauthorizedRedirectPath

            // #region listener

            /**
             * Listener to be executed when hashchange event is fired
             */
            self.listener = function () {
                if (reloadRequested) {
                    return;
                }

                var routeHash = window.location.hash;

                if (!routeHash) {
                    routeHash = hashPrefix;
                }

                var routeHashLower = toLowerCase(routeHash);

                runOnUnload(previousRouteHash);
                runOnLoad(routeHash, routeHashLower);
            };

            // #endregion listener

            // #region redirect

            /**
             * Redirect the window to the new path
             * @param {String} path - The route identifier to load
             */
            self.redirect = function (path) {
                var slashSlashIndex = path.indexOf("//");

                // Check if url is fully defined main url (account for http: or https:)
                if (slashSlashIndex >= 0 && slashSlashIndex <= 6) {
                    // Build the url with the base root path
                    path = flash.utils.buildUrl(path);

                    window.location = path;
                } else {
                    var builtHash = self.buildHash(path),
                        builtHashLower = toLowerCase(builtHash);

                    if (!builtHash) {
                        return;
                    }

                    if (window.location.hash === builtHash || window.location.hash === builtHashLower) {
                        runOnUnload(previousRouteHash);
                        runOnLoad(builtHash, builtHashLower);
                    } else {
                        window.location.hash = builtHash;
                    }
                }
            };

            // #endregion redirect

            // #region reload

            /**
             * reload the window to the new path
             * @param {String} path - The route identifier to load
             */
            self.reload = function (path) {
                templating.displayPageLoading();

                reloadRequested = true;

                var slashSlashIndex = path.indexOf("//");

                // Check if the path is not a fully defined url or fully defined url is not main (account for http: or https:)
                if (slashSlashIndex < 0 || slashSlashIndex > 6) {
                    path = self.buildHash(path);
                }

                // Build the url with the base root path
                path = flash.utils.buildUrl(path);

                window.location = path;

                // Reload page if a hash prefix exists, since this would trigger a hash change only
                if (path.indexOf(hashPrefix) >= 0) {
                    window.location.reload();
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

        // #region version

        /**
         * @returns {String} The flash version
         */
        Object.defineProperty(flash, "version", { get: function () { return "1.1.0"; } });

        // #endregion version

        // #region title

        /**
         * @returns {String} The application title
         */
        Object.defineProperty(flash, "title", { get: function () { return application.title; } });

        // #endregion title

        // #region activeTab

        /**
         * @returns {String} The application active tab
         */
        Object.defineProperty(flash, "activeTab", { get: function () { return application.activeTab; } });

        // #endregion activeTab

        // #region $templateContainerElement

        /**
         * @returns {Object} The application container jQuery object for template content
         */
        Object.defineProperty(flash, "$templateContainerElement", {
            get: function () {
                return $(application.settings.templateContainerElementSelector);
            }
        });

        // #endregion $templateContainerElement

        // #region templateContainerElementNode

        /**
         * @returns {Object} The application container element's node for template content
         */
        Object.defineProperty(flash, "templateContainerElementNode", {
            get: function () {
                return flash.$templateContainerElement.length > 0 ? flash.$templateContainerElement[0] : null;
            }
        });

        // #endregion templateContainerElementNode

        // #region $parentElement

        /**
         * @returns {Object} The current template parent jQuery object
         */
        Object.defineProperty(flash, "$parentElement", {
            get: function () {
                var elementSelector = flash.utils.isModalActive()
                    ? application.settings.modalParentElementSelector
                    : application.settings.documentParentElementSelector;

                return $(elementSelector);
            }
        });

        // #endregion $parentElement

        // #region $alertTargetElement

        /**
         * @returns {Object} The current template target jQuery object for alerts
         */
        Object.defineProperty(flash, "$alertTargetElement", {
            get: function () {
                var elementSelector = flash.utils.isModalActive()
                    ? application.settings.alertModalTargetElementSelector
                    : application.settings.alertPageTargetElementSelector;

                return $(elementSelector);
            }
        });

        // #endregion $alertTargetElement

        // #region statusMessage

        /**
         * @returns {Object} The application status message object
         */
        Object.defineProperty(flash, "statusMessage", {
            get: function () {
                return application.statusMessage;
            }
        });

        // #endregion statusMessage

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
                $.extend(application.settings, options);
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
                        unauthorizedRedirectPath = routing.buildHash(unauthorizedRedirectPath);
                    }

                    return application.resources.errorMessages.UNAUTHORIZED.replace(
                        regexFormatItem,
                        flash.utils.buildUrl(unauthorizedRedirectPath));
                }
            });

            // Load google analytics tracking libraries
            tracking.loadGoogleAnalytics();

            // Remove the noscript element if one exists to reduce size of DOM
            $("noscript").remove();

            // Check if user supplied position fixed elements for mobile
            if (flash.utils.object.isString(application.settings.mobilePositionFixedElementSelector)) {
                // On focus and blur for form elements, update position for fixed elements as virtual keyboard causes
                // issues
                $(document).on("focus", "input, textarea, select", function () {
                    if (flash.utils.isBrowserMobile()) {
                        $(application.settings.mobilePositionFixedElementSelector).css("position", "absolute");
                    }
                }).on("blur", "input, textarea, select", function () {
                    if (flash.utils.isBrowserMobile()) {
                        $(application.settings.mobilePositionFixedElementSelector).removeAttr("style");
                    }
                });
            }

            // Bind the routing listener to the hashchange event
            hashchange.bind(routing.listener);

            // Execute the listener based on the current hash
            routing.listener();
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

                // Scroll to the status message instantly
                flash.utils.scrollTo($parentElement, $targetElement);
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
                // Create the jQuery html object for the alert
                var $statusMessageElement = $("<div/>", {
                    "class": "alert alert-" + type,
                    "role": "alert"
                }).html(message);

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
            var self = {},

            // #region Private

            // #region Objects

            // #region verbs

                verbs = {
                    DELETE: "DELETE",
                    GET: "GET",
                    POST: "POST",
                    PUT: "PUT"
                };

            // #endregion verbs

            // #endregion Objects

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
                    var response = $.parseJSON(responseText);

                    // Make sure the response is an object and contains the ModelState object with errors
                    if (!response || !response.ModelState) {
                        flash.alert.dangerDefault();

                        return;
                    }

                    // Run through each error in the ModelState dictionary and display a help block for each error
                    for (var key in response.ModelState) {
                        if (response.ModelState.hasOwnProperty(key)) {
                            if (key === "_FORM") {
                                flash.alert.danger(response.ModelState[key][0]);

                                continue;
                            }

                            flash.utils.addHelpBlock(elementSelector, key, response.ModelState[key][0]);
                        }
                    }
                } catch (e) {
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
                    var response = $.parseJSON(responseText);

                    // Make sure the response is an object and contains the Path string
                    if (response && response.Path) {
                        routing.reload(response.Path);

                        return;
                    }

                    // If the response object did not contain the Path string, redirect to the error page
                    flash.utils.displayErrorPage(flash.http.statusCodes.BADREQUEST);
                } catch (e) {
                    flash.utils.displayErrorPage(flash.http.statusCodes.BADREQUEST);
                }
            }

            // #endregion triggerRedirect

            // #region ajax

            /**
             * Create and execute an HTTP request and return the jqXHR object
             * @param {String} verb - The HTTP Verb of the request
             * @param {String} url - The URL to which the request is sent
             * @param {Function} callback - The function that is executed when the request completes
             * @param {(Object|String)} obj - A plain object or string that is sent to the server with the request
             * @param {String} elementSelector - The form element selector
             */
            function ajax(verb, url, callback, obj, elementSelector) {
                var config = { url: flash.utils.buildUrl(url), method: verb };

                // Configure HTTP request based on verb
                if (verb === verbs.DELETE || verb === verbs.GET) {
                    config.cache = false;
                    config.async = false;
                }
                else if (verb === verbs.POST || verb === verbs.PUT) {
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
            }

            // #endregion ajax

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
                if (verb === verbs.POST || verb === verbs.PUT) {
                    // Reset the alerts and validation before handling the success 
                    flash.alert.reset();
                    flash.utils.resetValidation(elementSelector);
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
                templating.clear();

                if (verb === verbs.POST || verb === verbs.PUT) {
                    // Reset the alerts and validation before handling the error 
                    flash.alert.reset();
                    flash.utils.resetValidation(elementSelector);
                }

                var executeCallback = false;

                // Handle the error based on the returned status code
                if (jqXhr.status === self.statusCodes.REDIRECT) {
                    triggerRedirect(jqXhr.responseText);
                } else if (jqXhr.status === self.statusCodes.BADREQUEST && (verb === verbs.POST || verb === verbs.PUT)) {
                    displayFormErrors(elementSelector, jqXhr.responseText);

                    executeCallback = true;
                } else if (jqXhr.status === self.statusCodes.UNAUTHORIZED) {
                    if (application.settings.unauthroizedAutoRedirect) {
                        var unauthorizedRedirectPath = routing.getUnauthorizedRedirectPath();

                        routing.reload(unauthorizedRedirectPath);
                    } else if (verb === verbs.POST || verb === verbs.PUT) {
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
                    if (verb === verbs.POST || verb === verbs.PUT) {
                        flash.alert.dangerDefault();

                        executeCallback = true;
                    } else {
                        flash.utils.displayErrorPage(flash.http.statusCodes.BADREQUEST);
                    }
                }

                if ((verb === verbs.POST || verb === verbs.PUT) && executeCallback &&
                    flash.utils.object.isFunction(callback)) {
                    callback();
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
                if (verb === verbs.DELETE || verb === verbs.GET) {
                    return;
                }

                if (jqXhr.status !== self.statusCodes.REDIRECT && jqXhr.status !== self.statusCodes.FORBIDDEN) {
                    flash.utils.toggleSubmitButton(elementSelector);
                }
            }

            // #endregion alwaysCallback

            // #endregion Methods

            // #endregion Private

            // #region Public

            // #region Objects

            // #region statusCodes

            self.statusCodes = {
                BADREQUEST: 400,
                FORBIDDEN: 403,
                NOTFOUND: 404,
                REDIRECT: 302,
                UNAUTHORIZED: 401
            };

            // #endregion statusCodes

            // #endregion Objects

            // #region Methods

            // #region delete

            /**
             * Delete data from the server using a HTTP DELETE request and return the jqXHR object
             * @param {String} url - The URL to which the request is sent
             * @param {Function} callback - The function that is executed if the request succeeds
             */
            self.delete = function (url, callback) {
                return ajax(verbs.DELETE, url, callback);
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
                return ajax(verbs.GET, url, callback);
            };

            // #endregion get

            // #region getImage

            /**
             * Load an image from the server using a GET HTTP request
             * @param {String} src - The source of the image to load
             * @param {Function} callback - The function that is executed when the request completes
             */
            self.getImage = function (src, callback) {
                $("<img/>", {
                    src: flash.utils.buildUrl(src)
                }).load(function () {
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
                    .always(function (jqXhr, textStatus) {
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

                return ajax(verbs.POST, url, callback, obj, elementSelector);
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

                return ajax(verbs.PUT, url, callback, obj, elementSelector);
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
            self.add = routing.addRoute;

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
             */
            self.loadPartial = templating.loadPartial;

            // #endregion loadPartial

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
                if (!elementSelector || !key) {
                    return;
                }

                var $formElement = $(elementSelector).find(hashtag + key);

                if (!$formElement) {
                    return;
                }

                var $formGroupElement = $formElement.closest(".form-group");

                if (!$formGroupElement.length) {
                    return;
                }

                var $helpText = $("<span/>", {
                    "class": helpBlockClassName
                }).html(value);

                $formGroupElement.addClass(hasErrorClassName);
                $formGroupElement.append($helpText);
            };

            // #endregion addHelpBlock

            // #region applyRowGrouping

            /**
             * Group the elements in the object into a row div
             * @param {Object} $elements - The list of elements to group into rows
             * @param {Number} elementsPerGroup - The number of elements per group
             */
            self.applyRowGrouping = function ($elements, elementsPerGroup) {
                if (!$elements.length || !self.object.isNumber(elementsPerGroup)) {
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
                if (!elementSelector || !url) {
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

                // Return url if fully defined url is main (account for http: or https:), not a string or already contains
                // base root path
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

                if (self.object.isString(message)) {
                    var path = self.object.isString(errorPath) ? errorPath : errorPath.defaultPath;

                    application.statusMessage = new object.StatusMessage(flash.alert.types.DANGER, message);

                    routing.redirect(path);
                } else {
                    var path = errorPath[message] || errorPath.defaultPath;

                    routing.reload(path);
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
                application.statusMessage = new object.StatusMessage(type, message, description);

                routing.redirect(application.settings.messagePath);
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
                    if (ko.isObservable(target[prop])) {
                        target[prop](source[prop]);
                    } else if (source[prop] && typeof source[prop] === "object") {
                        target[prop] = extend(target[prop], source[prop]);
                    } else {
                        target[prop] = source[prop];
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
                return $.browser && $.browser.mobile || "ontouchstart" in window;
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
             */
            self.loadModal = templating.loadModalTemplate;

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
             */
            self.loadPage = templating.loadPageTemplate;

            // #endregion loadPage

            // #region removeHelpBlock

            /**
             * Remove the help block from the form element specified by the selector
             * @param {String} elementSelector - The selector of the form element
             */
            self.removeHelpBlock = function (elementSelector) {
                if (!elementSelector) {
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
                    // Check if a static header height was supplied, otherwise use the template container element to
                    // calculate top offset
                    topOffset = self.object.isNumber(application.settings.staticHeaderHeight)
                        ? application.settings.staticHeaderHeight
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
            self.setDocumentTitle = templating.setDocumentTitle;

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

                if (!$button.length) {
                    return;
                }

                var target = $button.attr("target");

                if (target === "_blank") {
                    return;
                }

                if ($button.attr(disabledAttrName)) {
                    $button.attr(disabledAttrName, false);

                    if (application.settings.showButtonLoading &&
                        !$button.hasClass(application.settings.buttonLoadingDisabledClassName)) {
                        $button.removeClass(application.settings.buttonLoadingClassName);
                        $button.removeAttr("style");
                    }
                } else {
                    $button.attr(disabledAttrName, true);

                    if (application.settings.showButtonLoading &&
                        !$button.hasClass(application.settings.buttonLoadingDisabledClassName)) {
                        $button.css({ height: $button.outerHeight(), width: $button.outerWidth() });

                        $button.addClass(application.settings.buttonLoadingClassName);
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
                            unbindEvent(event, elementSelector, elementParentSelector);
                        }
                    })(events[i]);
                }

                // A custom event that is not implemented
                exports["event"] = (function () {
                    return function (event, elementSelector, elementParentSelector) {
                        unbindEvent(event, elementSelector, elementParentSelector);
                    }
                })();

                // All events binded to the parent object
                exports["events"] = (function () {
                    return function (elementParentSelector) {
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

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);