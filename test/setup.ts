import chai from 'chai';
import { expect } from 'chai';

// Configure chai
chai.config.includeStack = true;

// Extend global type
declare global {
  var expect: Chai.ExpectStatic;
}

// Set global expect
global.expect = expect; 