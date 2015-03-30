var Form = require('../../form');

var Vue = require('vue');

module.exports = LocationForm;


function LocationForm(values) {
    if (!values) {
        values = {
            url: ''
        };
    }

    var schema = {
        url: {
            title: 'Url (example: /check)',
            type: 'String',
            view: 'Input',
            validate: [],
            required: true
        },
        method: {
            title: 'Method',
            type: 'String',
            view: 'Select',
            options: [
                {
                    text: 'GET',
                    value: 'GET'
                },
                {
                    text: 'POST',
                    value: 'POST'
                },
                {
                    text: 'PUT',
                    value: 'PUT'
                },
                {
                    text: 'PATCH',
                    value: 'PATCH'
                },
                {
                    text: 'DELETE',
                    value: 'DELETE'
                }
            ],
            default: 'GET',
            required: true
        },
        response: {
            title: 'Response',
            type: 'String',
            view: 'Textarea',
            required: true,
            validate: [{json: true}]
        }
    };

    var formFactory = new Form.Factory(schema, values);

    var form = new Form.Form(null, require('./templates/form.html'));

    var fields = formFactory.getFields();

    form.setFields(fields);
    form.setComponents(formFactory.getComponents());

    form.setFormData({
        type: 'create',
        id: null,
        valid: false,
        result: null
    });

    form.addMethods({
        disable: function() {
            $(this.$el).find('input').attr('disabled', true);
            $(this.$el).find('select').attr('disabled', true);
        },

        enable: function() {
            $(this.$el).find('input').attr('disabled', false);
            $(this.$el).find('select').attr('disabled', false);
        },

        changeType: function(type, id) {
            this.$set('type', type);

            if (type == 'create') {
                this.$set('id', null);
            } else {
                this.$set('id', id);
            }
        },

        save: function () {

            this.clearErrors();

            this.validate(function (err, valid) {

                if (valid) {
                    var that = this;

                    this.$parent.getLocationsApi().create(this.getValue(), function(err, data) {

                        if (err) {
                            if (err.status
                                && err.response
                                && err.response.body
                                && err.response.body.list
                            ) {
                                err.response.body.list.forEach(function(item) {
                                    that.errors.push(item.message);
                                });
                            } else {
                                console.log(err);
                            }

                            return;
                        }

                        that.$parent.addLocation(data.result);
                        that.clear();
                        that.$parent.hideAddForm();
                    });
                }
            });
        },

        update: function () {

            this.clearErrors();

            this.validate(function (err, valid) {

                if (valid) {
                    var that = this;

                    var validData = this.getValue();

                    var body = {
                        id: this.id,
                        response: validData.response
                    };

                    this.$parent.getLocationsApi().update(body, function(err, data) {

                        if (err) {
                            if (err.status
                                && err.response
                                && err.response.body
                                && err.response.body.list
                            ) {
                                err.response.body.list.forEach(function(item) {
                                    that.errors.push(item.message);
                                });
                            } else {
                                console.log(err);
                            }

                            return;
                        }

                        that.clear();
                        that.$parent.hideAddForm();
                    });
                }
            });
        },

        cancel: function () {
            this.clear();
            this.clearErrors();

            this.$parent.hideAddForm();
        }

    });

    return form;
}


