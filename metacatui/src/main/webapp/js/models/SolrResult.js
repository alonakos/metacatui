/*global define */
define(['jquery', 'underscore', 'backbone'], 				
	function($, _, Backbone) {
	'use strict';

	// SolrResult Model
	// ------------------
	var SolrResult = Backbone.Model.extend({
		// This model contains all of the attributes found in the SOLR 'docs' field inside of the SOLR response element
		defaults: {
			origin: '',
			title: '',
			pubDate: '',
			id: '',
			resourceMap: null,
			downloads: null,
			citations: 0,
			selected: false,
			formatId: null,
			formatType: null,
			memberNode: null,
			rightsHolder: null,
			size: 0,
			provSources: [],
			provDerivations: [],
			//Provenance index fields
			prov_generated: null,
			prov_generatedByDataONEDN: null,
			prov_generatedByExecution: null,
			prov_generatedByFoafName: null,
			prov_generatedByOrcid: null,
			prov_generatedByProgram: null,
			prov_generatedByUser: null,
 			prov_hasDerivations: null,
			prov_hasSources: null,
			prov_used: null,
			prov_usedByDataONEDN: null,
			prov_usedByExecution: null,
			prov_usedByFoafName: null,
			prov_usedByOrcid: null,
			prov_usedByProgram: null,
			prov_usedByUser: null,
			prov_wasDerivedFrom: null,
			prov_wasExecutedByExecution: null,
			prov_wasExecutedByUser: null,
			prov_wasGeneratedBy: null,
			prov_wasInformedBy: null
		},
		
		type: "SolrResult",
		
		// Toggle the `selected` state of the result
		toggle: function () {
			this.selected = !this.get('selected');
		},
		
		//Returns a plain-english version of the formatType and formatId
		getType: function(){
			//The list of formatIds that are images
			var imageIds = ["image/gif",
			                "image/jp2",
			                "image/jpeg",
			                "image/png",
			                "image/svg xml",
			                "image/svg+xml",
			                "image/tiff",
			                "image/bmp"];
			//The list of formatIds that are images
			var pdfIds = ["application/pdf"];	
			
			var instanceOfClass = this.get("prov_instanceOfClass");
			if(typeof instanceOfClass !== "undefined"){
				var programClass = _.filter(instanceOfClass, function(className){
					return (className.indexOf("#Program") > -1);
				});
			if((typeof programClass !== "undefined") && programClass.length) return "program";		
			}
			
			if(this.get("formatType") == "METADATA") return "metadata";
			if(_.contains(imageIds, this.get("formatId"))) return "image";
			if(_.contains(pdfIds, this.get("formatId")))   return "PDF";
						
			else return "data";
		},

		/**** Provenance-related functions ****/
		/*
		 * Returns true if this provenance field points to a source of this data or metadata object 
		 */
		isSourceField: function(field){
			if((typeof field == "undefined") || !field) return false;
			if(!_.contains(searchModel.getProvFields(), field)) return false;			
			
			if(field == "prov_generatedByExecution" ||
			   field == "prov_generatedByProgram"   ||
			   field == "prov_used" 		  		||
			   field == "prov_wasDerivedFrom" 		||
			   field == "prov_wasInformedBy") 
				return true;
			else
				return false;
		},
		
		/*
		 * Returns true if this provenance field points to a derivation of this data or metadata object 		 
		 */		
		isDerivationField: function(field){
			if((typeof field == "undefined") || !field) return false;
			if(!_.contains(searchModel.getProvFields(), field)) return false;
			
			if(field == "prov_usedByExecution" ||
			   field == "prov_usedByProgram"   ||
			   field == "prov_generated")
				return true;
			else
				return false;			
		},
		
		/*
		 * Returns true if this SolrResult has a provenance trace (i.e. has either sources or derivations)
		 */
		hasProvTrace: function(){
			if(this.get("formatType") == "METADATA"){
				if(this.get("prov_hasSources") || this.get("prov_hasDerivations"))
					return true;
			}
				
			var fieldNames = searchModel.getProvFields(),
				currentField = "";
			
			for(var i=0; i<= fieldNames.length; i++){
				currentField = fieldNames[i];
				if(this.has(currentField)) return true;
			}
			
			return false;
		},
		
		/* 
		 * Returns an array of all the IDs of objects that are sources of this object 
		 */
		getSources: function(){
			var sources = new Array(),
				model = this;
			
			_.each(searchModel.getProvFields(), function(provField, i){
				if(model.isSourceField(provField) && model.has(provField))
					sources.push(model.get(provField));
			});
			
			return _.uniq(_.flatten(sources));
		},
		
		/* 
		 * Returns an array of all the IDs of objects that are derivations of this object 
		 */		
		getDerivations: function(){
			var derivations = new Array(),
				model = this;
		
			_.each(searchModel.getProvFields(), function(provField, i){
				if(model.isDerivationField(provField) && model.get(provField))
					derivations.push(model.get(provField));
			});	
			
			return _.uniq(_.flatten(derivations));
		},
		/****************************/
		
		/**
		 * Convert number of bytes into human readable format
		 *
		 * @param integer bytes     Number of bytes to convert
		 * @param integer precision Number of digits after the decimal separator
		 * @return string
		 */
		bytesToSize: function(bytes, precision){  
		    var kilobyte = 1024;
		    var megabyte = kilobyte * 1024;
		    var gigabyte = megabyte * 1024;
		    var terabyte = gigabyte * 1024;
		    
		    if(typeof bytes === "undefined") var bytes = this.get("size");		    		    
		   
		    if ((bytes >= 0) && (bytes < kilobyte)) {
		        return bytes + ' B';
		 
		    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
		        return (bytes / kilobyte).toFixed(precision) + ' KB';
		 
		    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
		        return (bytes / megabyte).toFixed(precision) + ' MB';
		 
		    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
		        return (bytes / gigabyte).toFixed(precision) + ' GB';
		 
		    } else if (bytes >= terabyte) {
		        return (bytes / terabyte).toFixed(precision) + ' TB';
		 
		    } else {
		        return bytes + ' B';
		    }
		},

	});
	return SolrResult;
});
