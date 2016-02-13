/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var NullDependency = require("./NullDependency");

function HarmonyImportSpecifierDependency(importDependency, importedVar, id, name, range) {
	NullDependency.call(this);
	this.importDependency = importDependency;
	this.importedVar = importedVar;
	this.id = id;
	this.name = name;
	this.range = range;
}
module.exports = HarmonyImportSpecifierDependency;

HarmonyImportSpecifierDependency.prototype = Object.create(NullDependency.prototype);
HarmonyImportSpecifierDependency.prototype.constructor = HarmonyImportSpecifierDependency;
HarmonyImportSpecifierDependency.prototype.type = "harmony import specifier";

HarmonyImportSpecifierDependency.prototype.getReference = function() {
	if(!this.importDependency.module) return null;
	return {
		module: this.importDependency.module,
		importedNames: this.id ? [this.id] : true
	};
}

HarmonyImportSpecifierDependency.prototype.updateHash = function(hash) {
	NullDependency.prototype.updateHash.call(this, hash);
	var importedModule = this.importDependency.module;
	hash.update((importedModule && importedModule.id) + "");
	hash.update((importedModule && (importedModule.used + JSON.stringify(importedModule.usedExports))) + "");
};

HarmonyImportSpecifierDependency.Template = function HarmonyImportSpecifierDependencyTemplate() {};

HarmonyImportSpecifierDependency.Template.prototype.apply = function(dep, source) {
	var content;
	if(dep.id === "default" && !(dep.importDependency.module.meta && dep.importDependency.module.meta.harmonyModule)) {
		content = "(/* harmony import */0," + dep.importedVar + "_default.a)";
	} else if(dep.id) {
		var used = dep.importDependency.module.isUsed(dep.id);
		content = "(/* harmony import */0," + dep.importedVar + "[" + JSON.stringify(used) + "])";
	} else {
		content = "/* harmony namespace import */ " + dep.importedVar;
	}
	source.replace(dep.range[0], dep.range[1] - 1, content);
};