define(["jquery",
    "underscore",
    "backbone",
    "text!templates/metadata/EMLPartyDisplay.html",
    "views/project/ProjectSectionView"],
    function($, _, Backbone, EMLPartyDisplayTemplate, ProjectSectionView){

    /* The ProjectMembersView is a view to render the
     * project members tab (within ProjectSectionView)
     */
     var ProjectMembersView = ProjectSectionView.extend({
        el: "#project-members",
        type: "ProjectMembers",

      //   /* The list of subview instances contained in this view*/
      //   subviews: [], // Could be a literal object {}

      //   /* Renders the compiled template into HTML */
        template: _.template(EMLPartyDisplayTemplate),

      //   /* The events that this view listens to*/
      //   events: {

      //   },

      //   /* Construct a new instance of ProjectMembersView */
      //   initialize: function() {

      //   },

      //   /* Render the view */
        render: function() {
            var parties = this.model.get("associatedParties");
            var thisview = this;
            // Group parties into sets of 2 to do 2 per row
            var row_groups = _.groupBy(parties, function(parties, index) {
                return Math.floor(index / 2);
            });

            _.each(row_groups, function(row_group){
                // Create a new bootstrap row for each set of 2 parties
                var newdiv = $('<div class="row-fluid"></div>');
                // Put the empty row into the project members container
                thisview.$el.append(newdiv);
                // iterate for the 2 parties in this row
                _.each(row_group, function(party) {
                    // render party into its row
                    newdiv.append(thisview.template(party.toJSON()));
                    console.log(party.toJSON().phone);
                })
            });
        },

      //   onClose: function() {

      //   }

     });

     return ProjectMembersView;
});
