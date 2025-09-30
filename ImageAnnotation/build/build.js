'use strict';

var path = require("path"),
includeStyle,
buildUtils;

/** 
	buildUtils contains all necessary functions for copying and building files.
	---------------------------------------------------------------------------------------
	* Available functions :
	---------------------------------------------------------------------------------------
	* buildUtils.copy.file({options})
		-----options-----
		src : source file
		dist : destination file
		minify : [optional]	If file needs to be minified in production mode. 
			In development mode file will be copied.(default : false)
	---------------------------------------------------------------------------------------
	* buildUtils.copy.folder({options});
		-----options-----
		src : source folder
		dist : destination folder
		minify : [optional] If folder needs to be minified in production mode. 
			In development mode file will be copied.(default : false)
	---------------------------------------------------------------------------------------

**/

module.exports = {
	version: "1.0.0-RC",
	setCustomConfiguration : function(options) {
		options.customConfig = {
			outputFolder : "dist",
			eslint : false
		}
	},

	/*-----------------------------------------------Build Process Starts-------------------------------------------*/
	build : async function (options)  {
		buildUtils = new (require(path.join(options.cliRoot,'lib','utilities','buildUtils')))()
		/* Building of modules starts. Custom modules can be added in build function. */
		await buildUtils.init(options); /* Provides options to buildUtils. */		
		await buildUtils.build(options);	
	},
	/*-----------------------------------------------Build Process ends---------------------------------------------*/

	builder : {
		/*-----------------------------------------------------------------------------------------------------------*/
		copyAppDir : async function(module) {

			/* Comment folders to skip copying folders from source folder to destination folder. */
			/*By default outputFolder,routes,mixins,data-store,compdonents,build will be ignored from copying */
			/*Given folder should be relative to the root path*/
			var ignoreFolders = [
				'node_modules'	
			];
			await buildUtils._super(module,{
				ignoreFolders : ignoreFolders
			});
		},
		/*-----------------------------------------------------------------------------------------------------------*/
		routes : async function(module) {
			
			await buildUtils._super(module); 
			/** _super of routes
			----------------------
			* process the imported route file
			**/
			
		},

		/*-----------------------------------------------------------------------------------------------------------*/
		components : async function(module) {
			includeStyle = true;
			await buildUtils._super(module,{
				includeStyle : includeStyle
			});
			/** _super of components
			-------------------------
			* Compiles lyte files to html.
			* Precompiles html files to get dynamic nodes.
			* Appends style to template, if present. And then to component's javascript file.
			* 
			**/
			
		},

		/*-----------------------------------------------------------------------------------------------------------*/
		helpers : async function(module) {
			await buildUtils._super(module);
			/** _super of helpers
			----------------------
			*  process the imported helper file
			**/
			
		},

		/*-----------------------------------------------------------------------------------------------------------*/
		schemas : async function(module) {
			await buildUtils._super(module);
			/** _super of models
			----------------------
			* process the imported schema , adapter and serializer file
			* 
			**/
			
		},

		/*-----------------------------------------------------------------------------------------------------------*/
		mixins : async function(module) {
			await buildUtils._super(module);
			/** _super of mixins
			----------------------
			* process the imported mixin file
			* 
			**/
		}
		/*-----------------------------------------------------------------------------------------------------------*/
	},

	/*------------------------------------------Watch changes and build---------------------------------------------*/
	watcher : {
		/*-----------------------------------------------------------------------------------------------------------*/
		copyAppDir : async function(module,file,modification) {

			await buildUtils._super(module,{
				file : file,
				modification : modification
			}); 
			/** _super of copyAppDir
			----------------------
			* process the imported file other than routes, components, schemas, adapters, serializers ,helpers, mixins;
			**/
		},
		/*----------------------------------------------------------------------------------------------------------*/
		routes : async function(module,file,modification) {
			await buildUtils._super(module,{
				file :file,
				modification : modification 
			});
			/** _super of routes on watcher
			-------------------------------
			* process the specifed route files.	
			**/
		},

		/*----------------------------------------------------------------------------------------------------------*/
		components : async function(module,file,modification) {
			await buildUtils._super(module,{
				file : file,
				modification :modification,
				includeStyle : includeStyle
			});
			/** _super of components on watcher
			-----------------------------------
			* Compiles specified lyte files to html.
			* Precompiles specified html files to get dynamic nodes.
			* Appends style to template, if present. And then to component's javascript file.
			* 
			**/
		},

		/*----------------------------------------------------------------------------------------------------------*/
		helpers : async function(module,file,modification) {
			await buildUtils._super(module,{
				file : file,
				modification : modification
			});
			/** _super of helpers on watcher
			---------------------------------
			*  process the specifed helper files.	
			**/
		},

		/*----------------------------------------------------------------------------------------------------------*/
		schemas : async function(module,file,modification) {
			await buildUtils._super(module,{
				file :file,
				modification :modification
			});
			/** _super of schema on watcher
			-------------------------------
			*  process the specifed schema files.	
			**/
		},

		/*----------------------------------------------------------------------------------------------------------*/
		mixins : async function(module,file,modification) {
			await buildUtils._super(module,{
				file : file,
				modification :modification
			});
			/** _super of mixins on watcher
			---------------------------------
			*  process the specifed mixin files.	
			**/
		}

		
	}
};



