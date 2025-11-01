define("discourse/plugins/automation/admin-automation-route-map",["exports"],function(i){"use strict"
Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0
i.default={resource:"admin.adminPlugins.show",path:"/plugins",map(){this.route("automation",function(){this.route("new"),this.route("edit",{path:"/:id"})})}}}),define("discourse/plugins/automation/discourse/initializers/automation-admin-plugin-configuration-nav",["exports","discourse/lib/plugin-api"],function(i,t){"use strict"
Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0
i.default={name:"automation-admin-plugin-configuration-nav",initialize(i){const n=i.lookup("service:current-user")
n?.admin&&(0,t.withPluginApi)(i=>{i.addAdminPluginConfigurationNav("automation",[{label:"discourse_automation.title",route:"adminPlugins.show.automation"}])})}}})

//# sourceMappingURL=automation-4e7b46db.map