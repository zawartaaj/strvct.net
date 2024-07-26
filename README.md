# Strvct Overview

Applications are typically composed of 3 layers:

- UI
- Model
- Storage

The basic idea of Strvct is to put enough meta-information in the model layer to allow for the UI and Storage layers (and the synchronization between all 3 layers) to be handled automatically.
Effectively, you write the model and the rest is handled for you. This involves choosing uniform but flexible building blocks for each of the layers.

## Terminology

slots: objects which hold metadata about the instance variable related to type, persistance, synchronization.
nodes:

## Building Blocks

### Model Layer

- The model is composed of a graph of objects which inherit from BMNode (we'll call these "nodes").
- THe UI is largely a mirror of this grpah structure.
- The nodes are the unit of storage (one record per node).
- nodes have no references to views, but views can have references to nodes.
- nodes post notifications of their changes which the other layers can observe.
  -- the storage layer automatically observes objects read from storage

### UI Layer

- The UI is (basically) composed of `NodeView` (and subclasses) instances.
- Each `NodeView` points to a `BMNode` and watches for notifications from it.
- Multiple `NodeViews` may (and often do) point to the same `BMNode` instance.
- Slots on Views can be marked such that changes to them will schedule the view to sync it's state with the node.

### Persistence Layer

The app has a `PersistentObjectPool` which automatically:

- Monitors model (`BMNode` instance) mutations and stores changes.
- Bundles changes within an event loop into transactions which are stored atomically.
- Handles automatic garbage collection on the stored object graph.

## Uniform UI Structure

### StackViews and Tile Views

Strvct has a unified UI model based on `StackViews`.

- A `StackView` contains a `navView` and `otherView` which can be oriented left/right or top/bottom.
- `navView` typically contains a column (or row, if orientation is horizontal) of Tile views.
- When the user clicks on a Tile in a `navView`, it typically causes a new stack view to be created and placed inside the `StackView's` `otherView` (and its `navView` to be populated with the subnodes of the node the Tile represented).

### Fields

Fields are a type of node that can sync to a slot value via their `target` and `valueMethod` slots.
Examples: `BMStringField`, `BMNumberField`, `BMImageWellField`

### Node Subnodes

- Every node has a `subnodes` slot which is an array of nodes.
- Each node has a `parent` slot which points to its parent node.
- There are two ways subnodes typically get used:

#### Fields

- Stored fields (not a slot value, just free-floating)
- Unstored fields (set up on init, and have `target` & `valueMethod` to auto-sync with owner slot)

#### Non-Fields

- Stored (not a slot value, just free-floating)
- Unstored (may be added on init value of slot if `slot.setIsSubnode(true)`)

## Uniform Persistence Structure

- The storage system is a key/value store where the keys are unique object IDs and object records stored as JSON.
- Object records have a standard way of representing pointers to other objects (via their IDs), and using these, the store can do automatic on-disk garbage collection.
- Object records are JSON dicts containing a type (a class name) and a payload.
- On load, the record type is used to find a class reference, and then the class is asked to unserialize itself from the payload.
- The payload has a format that uses a standard way of referencing pointers to other object records, and during deserialization, the new instance can request the objects for these object IDs.

## Synchronization

BMNotificationCenter
SyncScheduler

## Getting Started

### For New Repos:

To set up the STRVCT submodule, run the following command from within your project folder:

```
git submodule add https://github.com/stevedekorte/strvct.net.git strvct
```

If you plan to deploy your app on GitHub Pages, add a `.nojekyll` file to your root folder.

### Setup

The build system is currently configured for Visual Studio Code (VSCode). To open the project, open the root source folder in VSCode.

1. Start the local HTTPS web server by running:

   ```
   node local-web-server/main.js
   ```

   in the root source folder.

2. Use the "launch local HTTPS" run option in VSCode to launch the app. It will open Chrome, and you'll need to ignore the SSL warning the first time (as we're using a local server).

### Recommended VSCode Extensions

To facilitate debugging and coding, install these VSCode extensions:

- ESLint (from Microsoft)
- JavaScript Debugger Nightly (from Microsoft)
- JSON (by ZainChen)

### Setting Up ESLint

If you don't have ESLint installed:

```
npm init @eslint/config -g
```

This installs it globally. For more information, visit: https://eslint.org/docs/latest/user-guide/getting-started

To use ESLint with ECMAScript 6 (ES6), add a `.eslintrc` configuration file to your home directory:

```json
{
  "env": {
    "es6": true
  }
}
```

If issues persist:

1. Verify this VSCode setting: `eslint.enable: true`
2. Run: `eslint init`

## Project Framework Overview

This project required the development of several custom frameworks:

- Meta object framework (slots)
- Extensive OO extensions to common classes
- Desktop-like web OO UI framework
- Architecture and protocol for model-to-view naked object UI, standard field components
- Miller column-inspired stacking UI framework
- Notifications system
- Auto-syncing system/protocol between model and views
- Integrated theming system
- Client-side object persistence / object pool framework
- Gesture recognition framework
- Package builder & boot and client-side caching system
- Auto resource management, loading, and caching system
- Common protocol for resources (fonts, sounds, images, icons, JSON data files)
- Transparent mutation observers for common classes
