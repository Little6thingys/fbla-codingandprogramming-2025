module.exports = {
    transformer: {
      unstable_allowRequireContext: true, // Ensure Metro processes all modules correctly
    },
    resolver: {
      unstable_disableInstrumentedBridgelessModuleResolution: true, // Disable bridgeless mode
    },
  };
  