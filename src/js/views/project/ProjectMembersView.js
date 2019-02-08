define(["jquery",
    "underscore",
    "backbone",
    "text!templates/metadata/EMLPartyDisplay.html",
    "views/project/ProjectSectionView",
    "views/project/ProjectLogosView",
    "text!templates/project/projectAcknowledgements.html",
    "text!templates/project/projectAwards.html"],
    function($, _, Backbone, EMLPartyDisplayTemplate, ProjectSectionView,
        ProjectLogosView, AcknowledgementsTemplate, AwardsTemplate){

    /* The ProjectMembersView is a view to render the
     * project members tab (within ProjectSectionView)
     */
     var ProjectMembersView = ProjectSectionView.extend({
        el: "#project-members",
        type: "ProjectMembers",

      //   /* The list of subview instances contained in this view*/
      //   subviews: [], // Could be a literal object {}

      //   /* Renders the compiled template into HTML */
        partyTemplate: _.template(EMLPartyDisplayTemplate),
        acknowledgementsTemplate: _.template(AcknowledgementsTemplate),
        awardsTemplate: _.template(AwardsTemplate),

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
                    // Create html links from the urls
                    var regex = /(.+)/gi;
                    var urlLink = [];
                    _.each(party.get("onlineUrl"), function(url){
                        console.log(url);
                        urlLink.push(url.replace(regex, '<a href="$&">$&</a>'));
                    });
                    // set the urlLinks into the model
                    party.set({'urlLink': urlLink});
                    console.log(party.get('urlLink'));
                    // render party into its row
                    newdiv.append(thisview.partyTemplate(party.toJSON()));
                });
            });

            var acknowledgements = this.model.get("acknowledgments") || "";
            var awards = this.model.get("awards") || "";

            if( awards !== "" || acknowledgements !== "" ) {
                var ack_div = $('<div class="well awards-info"></div>');
                this.$el.append(ack_div);
                ack_div.append(this.acknowledgementsTemplate(acknowledgements.toJSON()));
                if( acknowledgements !== "" ) {
                    // This is a little cludgy but we need some space here if
                    // there are acknowledgements and we don't need it if there
                    // aren't
                    ack_div.append("<br>");
                };
                ack_div.append(this.awardsTemplate({awards: awards}));
            };
        },

      //   onClose: function() {

      //   }

     });

     return ProjectMembersView;
});
