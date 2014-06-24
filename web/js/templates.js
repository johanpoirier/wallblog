Ember.TEMPLATES["comment-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<form>\r\n    <textarea name=\"text\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.anyComment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" rows=\"1\" tabindex=\"1\"></textarea>\r\n    <div class=\"masked\">\r\n        <span class=\"help-inline\"></span>\r\n        <input type=\"text\" name=\"author\" value=\"\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.authorHint", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" tabindex=\"2\" />\r\n\r\n        <button type=\"button\" class=\"btn\" tabindex=\"4\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\r\n        <button type=\"submit\" class=\"btn btn-success\" tabindex=\"3\"><i class=\"icon-ok icon-white\"></i> ");
  stack1 = helpers._triageMustache.call(depth0, "labels.submitComment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\r\n    </div>\r\n</form>");
  return buffer;
  
});
Ember.TEMPLATES["comment"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"author\">");
  stack1 = helpers._triageMustache.call(depth0, "author", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n<span class=\"delete\"><i class=\"icon-remove\"></i></span>\r\n<span class=\"date\">");
  data.buffer.push(escapeExpression((helper = helpers.formatDate || (depth0 && depth0.formatDate),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "date", "labels.dateTimeFormat", options) : helperMissing.call(depth0, "formatDate", "date", "labels.dateTimeFormat", options))));
  data.buffer.push("</span>\r\n<span>");
  stack1 = helpers._triageMustache.call(depth0, "text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>");
  return buffer;
  
});
Ember.TEMPLATES["filter-dates"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data,depth1) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n        <span class=\"alone");
  stack1 = (helper = helpers.ifequals || (depth1 && depth1.ifequals),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth1,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "year", "", options) : helperMissing.call(depth0, "ifequals", "year", "", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push(" selected");
  }

function program4(depth0,data) {
  
  
  data.buffer.push(" hidden");
  }

function program6(depth0,data,depth1) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n        <span data-value=\"");
  stack1 = helpers._triageMustache.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\"");
  stack1 = (helper = helpers.ifequals || (depth1 && depth1.ifequals),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth1,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "month", "value", options) : helperMissing.call(depth0, "ifequals", "month", "value", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(">");
  stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\n    ");
  return buffer;
  }
function program7(depth0,data) {
  
  
  data.buffer.push(" class=\"selected\"");
  }

  data.buffer.push("<div>\n    <div class=\"column year\">\n    ");
  stack1 = helpers.each.call(depth0, "years", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class=\"column month");
  stack1 = helpers.unless.call(depth0, "year", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\n    ");
  stack1 = helpers.each.call(depth0, "months", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</div>\n<button class=\"btn\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.validate", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>");
  return buffer;
  
});
Ember.TEMPLATES["filter-text"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("<i class=\"icon-remove-sign\" />");
  }

  data.buffer.push("<span class=\"text\">");
  stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\n");
  stack1 = helpers['if'].call(depth0, "clear", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});
Ember.TEMPLATES["header-edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"navbar-inner\">\r\n    <a href=\"/\" class=\"brand\">\r\n        <img src=\"/img/logo_m.png\" alt=\"Logo\" />\r\n    </a>\r\n    <span class=\"date\">");
  data.buffer.push(escapeExpression((helper = helpers.formatDate || (depth0 && depth0.formatDate),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "item.date", "labels.dateFormat", options) : helperMissing.call(depth0, "formatDate", "item.date", "labels.dateFormat", options))));
  data.buffer.push("</span> :\r\n    <input type=\"text\" name=\"description\" value=\"");
  stack1 = helpers._triageMustache.call(depth0, "item.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.enterDescription", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" />\r\n    <span class=\"delete\" style=\"display: inline;\">\r\n        ");
  stack1 = helpers._triageMustache.call(depth0, "labels.deletePicture", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    </span>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["header-zoom"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("\r\n                <img src=\"img/logo_m.png\" alt=\"Logo\" />\r\n            ");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push(" : ");
  stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n                ");
  stack1 = helpers['if'].call(depth0, "admin", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            ");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push(" : ");
  stack1 = helpers._triageMustache.call(depth0, "labels.addDescription", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" ");
  return buffer;
  }

  data.buffer.push("<header>\r\n    <div class=\"navbar navbar-fixed-top navbar-inverse\">\r\n        <div class=\"navbar-inner\">\r\n            ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'class': ("navbar-brand")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "items", options) : helperMissing.call(depth0, "link-to", "items", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            <span class=\"date\">");
  data.buffer.push(escapeExpression((helper = helpers['format-date'] || (depth0 && depth0['format-date']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","STRING"],data:data},helper ? helper.call(depth0, "date", "D MMMM YYYY", options) : helperMissing.call(depth0, "format-date", "date", "D MMMM YYYY", options))));
  data.buffer.push("</span>\r\n            <span class=\"description\">\r\n            ");
  stack1 = helpers['if'].call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            </span>\r\n            <span class=\"delete\" style=\"display: inline;\">\r\n                ");
  stack1 = helpers._triageMustache.call(depth0, "labels.deletePicture", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            </span>\r\n        </div>\r\n    </div>\r\n</header>");
  return buffer;
  
});
Ember.TEMPLATES["header"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\r\n                <img src=\"img/logo_m.png\" alt=\"Logo\" />\r\n                <img alt=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" src=\"img/titre.png\" />\r\n            ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1;
  stack1 = helpers._triageMustache.call(depth0, "nbItems", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" ");
  stack1 = helpers._triageMustache.call(depth0, "labels.picturesToClickAndComment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  }

  data.buffer.push("<header>\r\n    <div class=\"navbar navbar-fixed-top navbar-inverse\">\r\n        <div class=\"navbar-inner\">\r\n            ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'class': ("navbar-brand")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "items", options) : helperMissing.call(depth0, "link-to", "items", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            <p class=\"info pull-right\">");
  stack1 = (helper = helpers.unlessequals || (depth0 && depth0.unlessequals),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["ID","INTEGER"],data:data},helper ? helper.call(depth0, "nbItems", 0, options) : helperMissing.call(depth0, "unlessequals", "nbItems", 0, options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\r\n            <div class=\"filter\">Filtrer...</div>\r\n            <img alt=\"Admin\" title=\"Ajout de photos, modération des commentaires\" src=\"img/admin.png\" class=\"admin\" />\r\n            <img alt=\"Upload\" title=\"Ajout de photos\" src=\"img/upload.png\" class=\"upload\" />\r\n        </div>\r\n    </div>\r\n</header>");
  return buffer;
  
});
Ember.TEMPLATES["item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\r\n                <img src=\"http://life.jops-dev.com/pictures/");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" alt=\"\" />\r\n            ");
  return buffer;
  }

  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header-zoom", options) : helperMissing.call(depth0, "partial", "header-zoom", options))));
  data.buffer.push("\r\n<div class=\"main container-fluid\">\r\n    <div class=\"row\">\r\n        <div class=\"col-md-9 picture\">\r\n            ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "items", options) : helperMissing.call(depth0, "link-to", "items", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        </div>\r\n        <div class=\"col-md-3 commentBar\">\r\n            <h4>");
  stack1 = helpers._triageMustache.call(depth0, "labels.comments", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h4>\r\n            <div class=\"row-fluid commentForm\"></div>\r\n            <div class=\"row-fluid comments\"></div>\r\n        </div>\r\n    </div>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["items"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n        <div id=\"column");
  stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" class=\"column col-md-4\">\r\n        ");
  stack1 = helpers.each.call(depth0, "items", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n        </div>\r\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\r\n            ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "picture", options) : helperMissing.call(depth0, "partial", "picture", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header", options) : helperMissing.call(depth0, "partial", "header", options))));
  data.buffer.push("\r\n<div class=\"main container-fluid\">\r\n    <div class=\"row\">\r\n    ");
  stack1 = (helper = helpers['for'] || (depth0 && depth0['for']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["INTEGER","INTEGER"],data:data},helper ? helper.call(depth0, 1, 3, options) : helperMissing.call(depth0, "for", 1, 3, options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    </div>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<div class=\"modal-header\">\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\r\n    <h3 id=\"myModalLabel\">S'identifier</h3>\r\n</div>\r\n<div class=\"modal-body\">\r\n    <form class=\"form-horizontal\">\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"email\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"email\" name=\"email\" id=\"email\" value=\"\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\r\n            </div>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"password\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"password\" name=\"password\" id=\"password\" value=\"\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>\r\n<div class=\"modal-footer\">\r\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\r\n    <button class=\"btn btn-primary\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.validate", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["picture"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n        <img src=\"http://life.jops-dev.com/pictures/m2_");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" alt=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" id=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" class=\"wall\" />\r\n    ");
  stack1 = helpers['if'].call(depth0, "date", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    ");
  stack1 = helpers['if'].call(depth0, "comments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    ");
  stack1 = helpers['if'].call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\r\n        <span class=\"date\">");
  data.buffer.push(escapeExpression((helper = helpers['format-date'] || (depth0 && depth0['format-date']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","STRING"],data:data},helper ? helper.call(depth0, "date", "D MMMM YYYY", options) : helperMissing.call(depth0, "format-date", "date", "D MMMM YYYY", options))));
  data.buffer.push("</span>\r\n    ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n        <span class=\"nb-comments\">");
  stack1 = helpers._triageMustache.call(depth0, "comments.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n    ");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n        <span class=\"description\">");
  stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n    ");
  return buffer;
  }

  data.buffer.push("<div class=\"item\">\r\n    ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "item", "", options) : helperMissing.call(depth0, "link-to", "item", "", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["upload-video"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <div class=\"upload-video\">\n                <label for=\"video-");
  stack1 = helpers._triageMustache.call(depth0, "ext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">");
  stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\n                <input type=\"file\" name=\"video-");
  stack1 = helpers._triageMustache.call(depth0, "ext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" id=\"video-");
  stack1 = helpers._triageMustache.call(depth0, "ext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" />\n            </div>\n        ");
  return buffer;
  }

  data.buffer.push("<div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n    <h3 id=\"myModalLabel\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.uploadVideoTitle", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h3>\n</div>\n<div class=\"modal-body\">\n    <form class=\"form-horizontal\" enctype=\"multipart/form-data\" method=\"post\" action=\"\">\n        <div class=\"videos\">\n        ");
  stack1 = helpers.each.call(depth0, "formats", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n        <div class=\"control-group\">\n            <button type=\"button\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n            <button type=\"submit\" class=\"btn btn-success\"><i class=\"icon-ok icon-white\"></i> ");
  stack1 = helpers._triageMustache.call(depth0, "labels.uploadVideo", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n        </div>\n    </form>\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["upload"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <div class=\"upload-image\">\n                <div class=\"upload-image-zone\">\n                    <img src=\"");
  stack1 = helpers._triageMustache.call(depth0, "data", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" alt=\"");
  stack1 = helpers._triageMustache.call(depth0, "filename", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" />\n                </div>\n                <input type=\"text\" name=\"description-");
  stack1 = helpers._triageMustache.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.enterDescription", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth1],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" />\n            </div>\n        ");
  return buffer;
  }

  data.buffer.push("<div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n    <h3 id=\"myModalLabel\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.uploadTitle", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h3>\n</div>\n<div class=\"modal-body\">\n    <form class=\"form-horizontal\">\n        <div class=\"pictures\">\n        ");
  stack1 = helpers.each.call(depth0, "pictures", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n        <div class=\"control-group\">\n            <button type=\"button\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n            <button type=\"submit\" class=\"btn btn-success\"><i class=\"icon-ok icon-white\"></i> ");
  stack1 = helpers._triageMustache.call(depth0, "labels.uploadPictures", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n        </div>\n    </form>\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["user-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<div class=\"modal-header\">\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\r\n    <h3 id=\"myModalLabel\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.newUser", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</h3>\r\n</div>\r\n<div class=\"modal-body\">\r\n    <p>");
  stack1 = helpers._triageMustache.call(depth0, "labels.infoNewUser", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\r\n    <p>&nbsp;</p>\r\n    <form class=\"form-horizontal\">\r\n        <div class=\"control-group\" id=\"groupEmail\">\r\n            <label class=\"control-label\" for=\"email\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"email\" name=\"email\" id=\"email\" value=\"\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\r\n                <span class=\"help-inline hide\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.emailError", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"password\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"password\" name=\"password\" id=\"password\" value=\"\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\r\n            </div>\r\n        </div>\r\n        <div class=\"control-group\" id=\"groupRepeatPassword\">\r\n            <label class=\"control-label\" for=\"password\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.repeatPassword", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"password\" name=\"repeatPassword\" id=\"repeatPassword\" value=\"\" placeholder=\"");
  stack1 = helpers._triageMustache.call(depth0, "labels.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\">\r\n                <span class=\"help-inline hide\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.passwordsNotIdenticals", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>\r\n<div class=\"modal-footer\">\r\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\r\n    <button class=\"btn btn-primary\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.validate", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["video"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<video controls>\r\n    <source src=\"/videos/");
  stack1 = helpers._triageMustache.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(".mp4\" type=\"video/mp4\" />\r\n    <source src=\"/videos/");
  stack1 = helpers._triageMustache.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(".webm\" type=\"video/webm\" />\r\n    <source src=\"/videos/");
  stack1 = helpers._triageMustache.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(".ogv\" type=\"video/ogg\" />\r\n</video>");
  return buffer;
  
});