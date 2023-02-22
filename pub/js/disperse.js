"use strict"

const c = document.querySelector("canvas")
const lib = new AEB(c, 6, 5, "black")

lib.disperse("disperse", 70, 150, 150, 20, 0.5, false)