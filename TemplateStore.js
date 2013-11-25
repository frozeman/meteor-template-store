/**
Template helpers

@module package template-store
**/


/**
The `TemplateStore` class is used for making reactive property transfers between helpers and callbacks.

This works like sessions with an added id, to make it unique for template instances.
The `this` in the following examples, can either be the data context from within a helper,
or the template instance from a template callback (like `created()`,`rendered()`,`destroyed()` or events).
It will then look for the `_id` property to be use as the instance as identifier.
You can also pass your own custom ID, but you have to make sure, that you also pass this same ID everytime you call `TemplateStore.get()` or  `TemplateStore.set()`.
If you don't pass an ID a standard ID will be used, which is then the same for all stores with the given property name (which makes it a general session).

To set and get properties does as follow:

    // set a property
    TemplateStore.set(this,'cards_tvguide_broadcast->myProperty','myValue');

    // to get it inside a helper, or callback
    TemplateStore.get(this,'cards_tvguide_broadcast->myProperty');

Additional you can pass a third options parameter with `{reactive: false}`, to prevent reactive reruns.

**Note** Be aware that your data context need to have an `_id` property,
otherwise you have to manually set an id parameter with an value which is accessable from inside the helpers or callbacks (e.g setting an id manually to the data context).

You also should be aware when using the `{{#with}}` helper, as this changes the data context.

**Re-run**
You cans also use the `TemplateStore` to reactivily "re-run" helpers by setting the value to `rerun`.
This will just rerun all reactive helpers which call `TemplateStore.get()`.

@class TemplateStore
@constructor
**/
TemplateStore = {
    /**
    This object stores all keys and their values.

    @property keys
    @type Object
    @default {}
    @example

        {
            245ufgdger_myTemplate->myProperty: "myValue",
            ...
        }

    **/
    keys: {},


    /**
    Keeps the dependencies for the keys in the store.

    @property deps
    @type Object
    @default {}
    @example

        {
            245ufgdger_myTemplate->myProperty: new Deps.Dependency,
            ...
        }

    **/
    deps: {},


    // METHODS

    // PRIVATE
    /**
    Creates at least ones a `Deps.Dependency` object to a key.

    @method _ensureDeps
    @private
    @param {String} key     the name of the key to add a dependecy tracker to
    @return undefined
    **/
    _ensureDeps: function (key) {
        if (!this.deps[key]){
            this.deps[key] = new Deps.Dependency;
        }
    },

    /**
    Generates the key name e.g. `myId12344_myKeyName`.

    @method _getKeyName
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @return {String} The generated key name.
    **/
    _getKeyName: function(id, propertyName){
        if(!id)
            id = 'default';
        else if(_.isObject(id))
            id = (id.data) ? id.data._id : id._id;

        // build the keyname
        return id + '_' + propertyName;
    },


    // PUBLIC

    /**
    When get is called we create a `Deps.Dependency.depend()` for that key in the store.

    @method get
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return {Mixed} The stored value.
    **/
    get: function (id, propertyName, options) {
        var keyName = this._getKeyName(id, propertyName);

        this._ensureDeps(keyName);

        if(!options || options.reactive !== false)
            this.deps[keyName].depend();

        return this.keys[keyName];
    },


    /**
    When set is called every depending reactive function where `View.get()` with the same key is called will rerun.

    @method set
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    set: function (id, propertyName, value, options) {
        var keyName = this._getKeyName(id, propertyName);

        this._ensureDeps(keyName);

        // only reload the dependencies, when value actually changed
        if(value === 'rerun') {

            this.deps[keyName].changed();

        } else if((!_.isObject(value) && this.keys[keyName] !== value) ||
                  (_.isObject(value) && !_.isEqual(this.keys[keyName], value))) {
            this.keys[keyName] = value;

            if(!options || options.reactive !== false)
                this.deps[keyName].changed();
        }
    },


    /**
    Clears a set property.

    **Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

    @method unset
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    unset: function (id, propertyName, options) {
        var keyName = this._getKeyName(id, propertyName);

        if(options && options.reactive === true)
            this.deps[keyName].changed();

        delete this.keys[keyName];
        delete this.deps[keyName];

    },

    /**
    Clears all instances of a set property.

    **Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

    @method unsetAll
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    unsetAll: function (propertyName, options) {
        var _this = this,
            keys = [];

        // find all keys containing this property name
        _.each(this.keys, function(key, keyName){
            // delet those keys and dependecies
            if (keyName.indexOf(propertyName) !== -1) {
                if(options && options.reactive === true)
                    _this.deps[keyName].changed();

                delete _this.keys[keyName];
                delete _this.deps[keyName];
            }
        });

    }
};