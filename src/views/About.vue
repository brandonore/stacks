<template>
    <div class="about mx-3">
        <h3 class="mb-5 mt-3 secondary--text">About</h3>
        <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex xs12 class="text-center secondary--text"><h1>Stacks</h1></v-flex>
                <v-flex xs12 class="text-center grey--text title font-weight-regular">Inventory Management for the Concentrate Companies of Colorado</v-flex>
                <v-flex xs12 class="text-center grey--text subtitle">Coded with ❤️ in CO by Brandon Ore</v-flex>
                <v-flex xs12 class="text-center"><a href="https://github.com/brandonore"><v-icon>fab fa-github-alt</v-icon></a></v-flex>
                <v-flex xs12 class="text-center grey--text subtitle font-weight-bold">App Version: {{ changelog.slice(-1)[0].version }}</v-flex>
                <v-flex xs12 class="text-center grey--text subtitle mb-5">Thanks to <a href="https://www.fiverr.com/rimonmath">rimonmath</a> & <a href="https://www.fiverr.com/arslan_96">arslan_96</a> for the bug fixes!</v-flex>
                <v-flex class="text-center secondary--text mt-5"><h2>App Changelog</h2></v-flex>
                <v-flex d-flex xs12 width="100%">
                    <v-card flat class="mx-auto px-5" width="100%" max-width="750">
                        <v-flex v-for="item in changelog.slice().reverse()" :key="item.version">
                            <v-card-title>{{ item.version }}</v-card-title>
                            <v-card-text>{{ item.date }}</v-card-text>
                            <v-divider></v-divider>
                            <v-card-text>{{ item.desc }}</v-card-text>
                            <v-divider></v-divider>
                            <v-chip v-if="item.new" class="mx-5 mt-5 px-5" small label color="success">New</v-chip>
                            <v-card-text v-if="item.new" class="ml-1">{{ item.new }}</v-card-text>
                            <v-chip v-if="item.bugfix" class="mx-5 px-5" small label color="error">Bug Fix</v-chip>
                            <v-card-text v-if="item.bugfix" class="ml-1">{{ item.bugfix }}</v-card-text>
                            <v-chip v-if="item.improved" class="mx-5 px-5 mt-5 white--text" small label color="alternate">Improved</v-chip>
                            <v-card-text v-if="item.improved" class="ml-1">{{ item.improved }}</v-card-text>
                        </v-flex>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

export default {
name: 'about',
data() {
    return {
        changelog: [
            { version: 'v1.0.0', date: 'Sept 05, 2019', desc: 'First release. Small tweaks on the way', new: '- Initial stable release', bugfix: null, improved: null },
            { version: 'v1.0.1', date: 'Sept 06, 2019', 
                desc: 'New addition and bug fixes!', 
                new: '- Added about page w/ changelog system', 
                bugfix: '- Removed x icons from the packaging and delivery tables', 
                improved: null 
            },
            { version: 'v1.0.2', date: 'Sept 16, 2019', 
                desc: 'Tweaks & bug fixes!', 
                new: `- New login & signup design with animation on larger screens`, 
                bugfix: `- Fixed text breaking on dashboard for small screens/lower resolution 
                        - Removed calendar and delivery stat from dashboard.`, 
                improved: '- CSS tweaks with padding and width' 
            },
        ]
    }
},
}
</script>

<style>

</style>