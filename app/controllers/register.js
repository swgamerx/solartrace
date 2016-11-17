import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        register() {
            let controller = this;
            this.get('firebase').createUser({
                email: this.get('email') || '',
                password: this.get('password') || '',
            }, (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    controller.set('email', null);
                    controller.set('password', null);
                }
            });
        }
    }
});