Ember.TEMPLATES["comment-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<form>\r\n    <textarea name=\"text\" class=\"form-control\" ");
  data.buffer.push(escapeExpression((helper = helpers.translateAttr || (depth0 && depth0.translateAttr),options={hash:{
    'placeholder': ("anyComment")
  },hashTypes:{'placeholder': "STRING"},hashContexts:{'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "translateAttr", options))));
  data.buffer.push(" rows=\"1\" tabindex=\"1\"></textarea>\r\n    <div class=\"masked\">\r\n        <span class=\"help-inline\"></span>\r\n        <input type=\"text\" class=\"form-control\" name=\"author\" value=\"\" ");
  data.buffer.push(escapeExpression((helper = helpers.translateAttr || (depth0 && depth0.translateAttr),options={hash:{
    'placeholder': ("authorHint")
  },hashTypes:{'placeholder': "STRING"},hashContexts:{'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "translateAttr", options))));
  data.buffer.push(" tabindex=\"2\" />\r\n\r\n        <button type=\"button\" class=\"btn\" tabindex=\"4\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel", options) : helperMissing.call(depth0, "t", "cancel", options))));
  data.buffer.push("</button>\r\n        <button type=\"submit\" class=\"btn btn-success\" tabindex=\"3\"><i class=\"icon-ok icon-white\"></i> ");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "submitComment", options) : helperMissing.call(depth0, "t", "submitComment", options))));
  data.buffer.push("</button>\r\n    </div>\r\n</form>");
  return buffer;
  
});
Ember.TEMPLATES["comment"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"col-md-11 comment\">\r\n    <span class=\"author\">");
  stack1 = helpers._triageMustache.call(depth0, "author", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n    <span class=\"delete\"><i class=\"icon-remove\"></i></span>\r\n    <span class=\"date\">");
  data.buffer.push(escapeExpression((helper = helpers['format-date'] || (depth0 && depth0['format-date']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "date", "dateFormat", options) : helperMissing.call(depth0, "format-date", "date", "dateFormat", options))));
  data.buffer.push("</span>\r\n    <span>");
  stack1 = helpers._triageMustache.call(depth0, "text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["filter-dates"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

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
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "validate", options) : helperMissing.call(depth0, "t", "validate", options))));
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
Ember.TEMPLATES["grid"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n    <div id=\"column");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" class=\"column ");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "class", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\">\r\n        ");
  stack1 = helpers.each.call(depth0, "items", {hash:{
    'itemController': ("item")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    </div>\r\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\r\n            ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "picture", options) : helperMissing.call(depth0, "partial", "picture", options))));
  data.buffer.push("\r\n        ");
  return buffer;
  }

  stack1 = helpers.each.call(depth0, "view.columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});
Ember.TEMPLATES["header-edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("\r\n        <img src=\"img/logo_m.png\" alt=\"Logo\" />\r\n    ");
  }

  data.buffer.push("<div class=\"navbar-inner\">\r\n    ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'class': ("navbar-brand")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "items", options) : helperMissing.call(depth0, "link-to", "items", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    <span class=\"date\">");
  data.buffer.push(escapeExpression((helper = helpers.formatDate || (depth0 && depth0.formatDate),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "item.date", "dateFormat", options) : helperMissing.call(depth0, "formatDate", "item.date", "dateFormat", options))));
  data.buffer.push("</span> :\r\n    <input type=\"text\" name=\"description\" value=\"");
  stack1 = helpers._triageMustache.call(depth0, "item.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\" placeholder=\"");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "enterDescription", options) : helperMissing.call(depth0, "t", "enterDescription", options))));
  data.buffer.push("\" />\r\n    <span class=\"delete\" style=\"display: inline;\">\r\n        ");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deletePicture", options) : helperMissing.call(depth0, "t", "deletePicture", options))));
  data.buffer.push("\r\n    </span>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["header-zoom"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

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
  
  var buffer = '', helper, options;
  data.buffer.push(" : ");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "addDescription", options) : helperMissing.call(depth0, "t", "addDescription", options))));
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

  data.buffer.push("<header>\r\n    <div class=\"navbar navbar-fixed-top navbar-inverse\">\r\n        <div class=\"navbar-inner\">\r\n            ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'class': ("navbar-brand")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "items", options) : helperMissing.call(depth0, "link-to", "items", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            <p class=\"info pull-right\">");
  stack1 = helpers._triageMustache.call(depth0, "nbItems", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" ");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "picturesToClickAndComment", options) : helperMissing.call(depth0, "t", "picturesToClickAndComment", options))));
  data.buffer.push("</p>\r\n            <div class=\"filter\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "filter", options) : helperMissing.call(depth0, "t", "filter", options))));
  data.buffer.push("</div>\r\n            <img alt=\"Admin\" title=\"Ajout de photos, modération des commentaires\" src=\"img/admin.png\" class=\"admin\" />\r\n            <img alt=\"Upload\" title=\"Ajout de photos\" src=\"img/upload.png\" class=\"upload hidden\" />\r\n        </div>\r\n    </div>\r\n</header>");
  return buffer;
  
});
Ember.TEMPLATES["item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\r\n                    <img src=\"http://wallblog.jops-dev.com/pictures/");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" alt=\"\" />\r\n                ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\r\n                ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "comment", options) : helperMissing.call(depth0, "partial", "comment", options))));
  data.buffer.push("\r\n            ");
  return buffer;
  }

  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header-zoom", options) : helperMissing.call(depth0, "partial", "header-zoom", options))));
  data.buffer.push("\r\n<div class=\"main container-fluid\">\r\n    <div class=\"row full-height\">\r\n        <div class=\"col-md-9\">\r\n            <div class=\"picture\">\r\n                ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "items", options) : helperMissing.call(depth0, "link-to", "items", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            </div>\r\n        </div>\r\n        <div class=\"col-md-3 commentBar\">\r\n            <h4>");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "comments", options) : helperMissing.call(depth0, "t", "comments", options))));
  data.buffer.push("</h4>\r\n            <div class=\"row commentForm\">\r\n                ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "comment-form", options) : helperMissing.call(depth0, "partial", "comment-form", options))));
  data.buffer.push("\r\n            </div>\r\n            <div class=\"row comments\">\r\n            ");
  stack1 = helpers.each.call(depth0, "comments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["items"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header", options) : helperMissing.call(depth0, "partial", "header", options))));
  data.buffer.push("\r\n<div class=\"main container-fluid\">\r\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Wallblog.GridView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"modal-header\">\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\r\n    <h3 id=\"myModalLabel\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "login.title", options) : helperMissing.call(depth0, "t", "login.title", options))));
  data.buffer.push("</h3>\r\n</div>\r\n<div class=\"modal-body\">\r\n    <form class=\"form-horizontal\">\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"email\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "t", "email", options))));
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"email\" name=\"email\" id=\"email\" value=\"\" placeholder=\"");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "t", "email", options))));
  data.buffer.push("\">\r\n            </div>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"password\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "password", options) : helperMissing.call(depth0, "t", "password", options))));
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"password\" name=\"password\" id=\"password\" value=\"\" placeholder=\"");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "password", options) : helperMissing.call(depth0, "t", "password", options))));
  data.buffer.push("\">\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>\r\n<div class=\"modal-footer\">\r\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel", options) : helperMissing.call(depth0, "t", "cancel", options))));
  data.buffer.push("</button>\r\n    <button class=\"btn btn-primary\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "validate", options) : helperMissing.call(depth0, "t", "validate", options))));
  data.buffer.push("</button>\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["picture"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n        <img src=\"http://wallblog.jops-dev.com/pictures/m2_");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" alt=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "file", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" id=\"");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\" class=\"wall\" />\r\n    ");
  stack1 = helpers['if'].call(depth0, "date", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n    ");
  stack1 = helpers['if'].call(depth0, "hasComments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
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
  data.buffer.push(escapeExpression((helper = helpers['format-date'] || (depth0 && depth0['format-date']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "date", "dateFormat", options) : helperMissing.call(depth0, "format-date", "date", "dateFormat", options))));
  data.buffer.push("</span>\r\n    ");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\r\n        <span class=\"nb-comments\">");
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "nbComments", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
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
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

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
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, ".uploadVideoTitle", options) : helperMissing.call(depth0, "t", ".uploadVideoTitle", options))));
  data.buffer.push("</h3>\n</div>\n<div class=\"modal-body\">\n    <form class=\"form-horizontal\" enctype=\"multipart/form-data\" method=\"post\" action=\"\">\n        <div class=\"videos\">\n        ");
  stack1 = helpers.each.call(depth0, "formats", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n        <div class=\"control-group\">\n            <button type=\"button\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel", options) : helperMissing.call(depth0, "t", "cancel", options))));
  data.buffer.push("</button>\n            <button type=\"submit\" class=\"btn btn-success\"><i class=\"icon-ok icon-white\"></i> ");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "uploadVideo", options) : helperMissing.call(depth0, "t", "uploadVideo", options))));
  data.buffer.push("</button>\n        </div>\n    </form>\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["upload"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
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
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "enterDescription", options) : helperMissing.call(depth0, "t", "enterDescription", options))));
  data.buffer.push("\" />\n            </div>\n        ");
  return buffer;
  }

  data.buffer.push("<div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n    <h3 id=\"myModalLabel\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "uploadTitle", options) : helperMissing.call(depth0, "t", "uploadTitle", options))));
  data.buffer.push("</h3>\n</div>\n<div class=\"modal-body\">\n    <form class=\"form-horizontal\">\n        <div class=\"pictures\">\n        ");
  stack1 = helpers.each.call(depth0, "pictures", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </div>\n        <div class=\"control-group\">\n            <button type=\"button\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel", options) : helperMissing.call(depth0, "t", "cancel", options))));
  data.buffer.push("</button>\n            <button type=\"submit\" class=\"btn btn-success\"><i class=\"icon-ok icon-white\"></i> ");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "uploadPictures", options) : helperMissing.call(depth0, "t", "uploadPictures", options))));
  data.buffer.push("</button>\n        </div>\n    </form>\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["user-form"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"modal-header\">\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\r\n    <h3 id=\"myModalLabel\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "newUser", options) : helperMissing.call(depth0, "t", "newUser", options))));
  data.buffer.push("</h3>\r\n</div>\r\n<div class=\"modal-body\">\r\n    <p>");
  stack1 = helpers._triageMustache.call(depth0, "labels.infoNewUser", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\r\n    <p>&nbsp;</p>\r\n    <form class=\"form-horizontal\">\r\n        <div class=\"control-group\" id=\"groupEmail\">\r\n            <label class=\"control-label\" for=\"email\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "t", "email", options))));
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"email\" name=\"email\" id=\"email\" value=\"\" placeholder=\"");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "email", options) : helperMissing.call(depth0, "t", "email", options))));
  data.buffer.push("\">\r\n                <span class=\"help-inline hide\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emailError", options) : helperMissing.call(depth0, "t", "emailError", options))));
  data.buffer.push("</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"control-label\" for=\"password\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "password", options) : helperMissing.call(depth0, "t", "password", options))));
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"password\" name=\"password\" id=\"password\" value=\"\" placeholder=\"");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "password", options) : helperMissing.call(depth0, "t", "password", options))));
  data.buffer.push("\">\r\n            </div>\r\n        </div>\r\n        <div class=\"control-group\" id=\"groupRepeatPassword\">\r\n            <label class=\"control-label\" for=\"password\">");
  stack1 = helpers._triageMustache.call(depth0, "labels.repeatPassword", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</label>\r\n            <div class=\"controls\">\r\n                <input type=\"password\" name=\"repeatPassword\" id=\"repeatPassword\" value=\"\" placeholder=\"");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "password", options) : helperMissing.call(depth0, "t", "password", options))));
  data.buffer.push("\">\r\n                <span class=\"help-inline hide\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "passwordsNotIdenticals", options) : helperMissing.call(depth0, "t", "passwordsNotIdenticals", options))));
  data.buffer.push("</span>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>\r\n<div class=\"modal-footer\">\r\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel", options) : helperMissing.call(depth0, "t", "cancel", options))));
  data.buffer.push("</button>\r\n    <button class=\"btn btn-primary\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "validate", options) : helperMissing.call(depth0, "t", "validate", options))));
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