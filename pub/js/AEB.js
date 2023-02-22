"use strict";


function AEB(canvas, r=5, border_width=5, color="black", filled=false, horizontal_spacing=10, vertical_spacing=15) {
    // general attributes required for all animations
    this.c = canvas
    this.x_modifier = null
    this.y_modifier = null
    this.r = r
    this.border_width = border_width
    this.horizontal_spacing = horizontal_spacing
    this.vertical_spacing = vertical_spacing
    if (this._checkColorString(color)) {
        this.color = color
    } else if (color === "random"){
        this.color = "random"
    } else {
        console.error("Invalid color string: using default(black) color!")
        this.color="black"
    }
    if (typeof filled !== "boolean") {
            this.filled = false
    } else {
        this.filled=filled
    }
    
    // cursor attributes
    this.cursor = {
            x: -canvas.width,
            y: -canvas.height,
            r: 0
    }

    this.requestId = null
}

AEB.prototype = {

        // helper function that returns the coordinates of points used to form specific character
        number_coords: function(char, x_modifier, y_modifier, r) {

                const coords = {"0": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r], [x_modifier, y_modifier+2*r],
                [x_modifier, y_modifier+4*r],[x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r], [x_modifier, y_modifier+6*r]],
        
                "1": [[x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "2": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r],
                     [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                     [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r], [x_modifier, y_modifier+6*r]],
        
                "3": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r],
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
                     
                "4": [[x_modifier, y_modifier], [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r],
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier+6*r, y_modifier+8*r]],
        
                
                "5": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier, y_modifier+2*r],
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "6": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier, y_modifier+2*r],
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r], [x_modifier, y_modifier+6*r]],
        
                "7": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r],
                [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier+6*r, y_modifier+8*r]],
        
        
                "8": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r], [x_modifier, y_modifier+2*r],
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r], [x_modifier, y_modifier+6*r]],
        
                "9": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], [x_modifier+6*r, y_modifier+2*r], [x_modifier, y_modifier+2*r],
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier+6*r, y_modifier+8*r]],
        
                // letters
                "A": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                [x_modifier, y_modifier+2*r],[x_modifier+6*r, y_modifier+2*r], 
                [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                [x_modifier, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "B": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier],
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r]],
        
                "C": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "D": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier],
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r]],
        
                "E": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r],  
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], 
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "F": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], 
                        [x_modifier, y_modifier+8*r]],
        
                "G": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "H": [[x_modifier, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "I": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier+2.5*r, y_modifier+2*r], 
                        [x_modifier+2.5*r, y_modifier+4*r],
                        [x_modifier+2.5*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "J": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier+4*r, y_modifier+2*r], 
                        [x_modifier+4*r, y_modifier+4*r],
                        [x_modifier+4*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r]],
        
                "K": [[x_modifier, y_modifier],[x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+4*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+5.5*r, y_modifier+5.5*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "L": [[x_modifier, y_modifier],
                        [x_modifier, y_modifier+2*r],
                        [x_modifier, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "M": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier+1.5*r], [x_modifier+4*r, y_modifier+1.5*r], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+3*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "N": [[x_modifier, y_modifier],  [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+2*r, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "O": [[x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r]],
        
                "P": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], 
                        [x_modifier, y_modifier+8*r]],
        
                "Q": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+4*r, y_modifier+6*r], 
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "R": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier],
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+2*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "S": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "T": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier+3*r, y_modifier+2*r], 
                        [x_modifier+3*r, y_modifier+4*r],
                        [x_modifier+3*r, y_modifier+6*r],
                        [x_modifier+3*r, y_modifier+8*r]],
        
                "U": [[x_modifier, y_modifier],[x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]], 
        
                "V": [[x_modifier, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier+3*r, y_modifier+8*r]], 
        
                "W": [[x_modifier, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier, y_modifier+4*r], [x_modifier+3*r, y_modifier+4*r], [x_modifier+6*r, y_modifier+4*r],
                        [x_modifier, y_modifier+6*r], [x_modifier+3*r, y_modifier+6*r], [x_modifier+6*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],
        
                "X": [[x_modifier, y_modifier],[x_modifier+6*r, y_modifier], 
                        [x_modifier+1.5*r, y_modifier+2*r], [x_modifier+4.5*r, y_modifier+2*r], 
                        [x_modifier+3*r, y_modifier+4*r],
                        [x_modifier+1.5*r, y_modifier+6*r], [x_modifier+4.5*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r],[x_modifier+6*r, y_modifier+8*r]], 
        
                "Y": [[x_modifier, y_modifier],[x_modifier+6*r, y_modifier], 
                        [x_modifier, y_modifier+2*r], [x_modifier+6*r, y_modifier+2*r], 
                        [x_modifier+2*r, y_modifier+4*r], [x_modifier+4*r, y_modifier+4*r],
                        [x_modifier+3*r, y_modifier+6*r],
                        [x_modifier+3*r, y_modifier+8*r]],
        
                "Z": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier], [x_modifier+4*r, y_modifier], [x_modifier+6*r, y_modifier], 
                        [x_modifier+4.5*r, y_modifier+2*r], 
                        [x_modifier+3*r, y_modifier+4*r],
                        [x_modifier+1.5*r, y_modifier+6*r],
                        [x_modifier, y_modifier+8*r], [x_modifier+2*r, y_modifier+8*r], [x_modifier+4*r, y_modifier+8*r], [x_modifier+6*r, y_modifier+8*r]],

                "t": [[x_modifier, y_modifier]], // created for testing purpose

                "a": [[x_modifier, y_modifier], [x_modifier+2*r, y_modifier]]
                }
                return coords[char]
        },

        _checkColorString: function(color_str) {
                const s = document.createElement("div")
                s.style.color = color_str
                return s.style.color !== ''
        },

        // textFall functions
        textFall: function(text="TEXT FALL", x_modifier=100, y_modifier=100) {
                // console.log(text)
                text = text.toUpperCase()
                if (typeof(text) !== "string" || text.length < 1) {
                console.error(`Animation failed to add: text argument should be a character string only! (ex: "123")`)
                // console.log(isNaN(text))
                // console.log(typeof(text) !== String)
                // console.log
                return
                }
                // modifiers are used as coordinates to center the text
                this.x_modifier = x_modifier
                this.y_modifier = y_modifier
                this.c.style.border = `${this.border_width}` + 'px solid black'
                const point_arr = this._animationInit(this.c, text, this.r, this.border_width, false)
                this.c.addEventListener("click", () =>{
                this._callTextfallAnimationLoop(point_arr, this.c)
                })
        },
            
        _animationInit: function(canvas, text, r, border_width, random_start) {
                const point_arr = []
                let dx = 0, dy = 0
                for (let i = 0; i < text.length; i ++) {
                //     console.log(dx)
                    if (text[i] === " ") {
                        dx += this.horizontal_spacing*r
                    } else if (text[i] === "/") {
                        dy += this.vertical_spacing*r
                        dx = 0
                    } else {
                        let curr_char_coords = this.number_coords(text[i], this.x_modifier, this.y_modifier, this.r)
                        for (let j = 0; j < curr_char_coords.length; j++) {
                                let new_point  = new _Point(curr_char_coords[j][0] + dx, curr_char_coords[j][1] + dy, r, canvas, border_width, this.color, this.filled)
                                if (new_point.x < r+border_width) {
                                        new_point.x += r+border_width
                                }
                                if (new_point.y < r+border_width) {
                                        new_point.y += r+border_width
                                }
                                if (random_start) {
                                        new_point.x = Math.random() * canvas.width
                                        new_point.y = Math.random() * canvas.height
                                        if (new_point.x < r+border_width) {
                                                new_point.x += r+border_width
                                        }
                                        if (new_point.y < r+border_width) {
                                                new_point.y += r+border_width
                                        }
                                }
                                point_arr.push(new_point)
                                new_point.draw()
                        }
                        dx += 10*r
                        // dy += 4*r
                    }
                }
                // console.log(dx)
                return point_arr
        },
            
        _textfallAnimationLoop: function(point_arr, canvas) {
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
                for (let i = 0; i < point_arr.length; i++) {
                    point_arr[i].update(point_arr)
                }
                requestAnimationFrame(() => {this._textfallAnimationLoop(point_arr, canvas)})
        },
            
        _callTextfallAnimationLoop: function(point_arr, canvas) {
                this.c.removeEventListener("click", this._callTextfallAnimationLoop)
                // console.log("removed")
                this._textfallAnimationLoop(point_arr, canvas)
        },

        scatter: function(text="SCATTER", x_modifier=100, y_modifier=100, cursor_range = 100, noise=0.5) {
                text = text.toUpperCase()
                if (typeof(text) !== "string" || text.length < 1) {
                    console.error(`Animation failed to add: text argument should be a string! (ex: "CSC309")`)
                    // console.log(isNaN(text))
                    // console.log(typeof(text) !== String)
                    // console.log
                    return
                }
                if (isNaN(x_modifier) || isNaN(y_modifier) || !isFinite(parseFloat(x_modifier)) || !isFinite(parseFloat(y_modifier))) {
                    console.error("x/y_modifer arguments need to be finite float numbers!")
                    return
                }
                this.x_modifier = x_modifier
                this.y_modifier = y_modifier
                this.cursor.r = cursor_range
                this.c.style.border = `${this.border_width}` + 'px solid black'
                const point_arr = this._animationInit(this.c, text, this.r, this.border_width)
                // update cursor position
                // since canvas might not take up the entire screen, we will need to find the rectangle that bounds the canvas, and calculate cursor position
                // accordingly
                const canvas_rect = this.c.getBoundingClientRect()
                this.c.addEventListener("mousemove", (event) =>{
                    this.cursor.x = event.x - canvas_rect.left
                    this.cursor.y = event.y - canvas_rect.top
                //     console.log(this.cursor)
                })
                this._scatterAnimationLoop(this.c, point_arr, this.cursor, noise)
        },

        _scatterAnimationLoop: function(canvas, point_arr, cursor, noise) {
                // console.log(noise)
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
                for (let i = 0; i < point_arr.length; i++) {
                        point_arr[i].scatter_update(cursor.x, cursor.y, cursor.r, noise)
                }
                requestAnimationFrame(() => this._scatterAnimationLoop(canvas, point_arr, cursor, noise))
        },

        // disperse animation
        disperse: function(text="DISPERSE", x_modifier=100, y_modifier=100, cursor_range = 100, return_speed=15, noise=0.5, random_start=false) {
                text = text.toUpperCase()
                if (typeof(text) !== "string" || text.length < 1) {
                    console.error(`Animation failed to add: text argument should be a string! (ex: "CSC309")`)
                    // console.log(isNaN(text))
                    // console.log(typeof(text) !== String)
                    // console.log
                    return
                }
                if (isNaN(x_modifier) || isNaN(y_modifier) || !isFinite(parseFloat(x_modifier)) || !isFinite(parseFloat(y_modifier))) {
                    console.error("x/y_modifer arguments need to be finite float numbers!")
                    return
                }
                this.x_modifier = x_modifier
                this.y_modifier = y_modifier
                this.cursor.r = cursor_range
                this.c.style.border = `${this.border_width}` + 'px solid black'
                const point_arr = this._animationInit(this.c, text, this.r, this.border_width, random_start)
                // update cursor position
                // since canvas might not take up the entire screen, we will need to find the rectangle that bounds the canvas, and calculate cursor position
                // accordingly
                const canvas_rect = this.c.getBoundingClientRect()
                this.c.addEventListener("mousemove", (event) =>{
                    this.cursor.x = event.x - canvas_rect.left
                    this.cursor.y = event.y - canvas_rect.top
                //     console.log(this.cursor)
                })
                this._disperseAnimationLoop(this.c, point_arr, this.cursor, return_speed, noise)
        },

        _disperseAnimationLoop: function(canvas, point_arr, cursor, return_speed, noise) {
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
                for (let i = 0; i < point_arr.length; i++) {
                        point_arr[i].disperse_update(cursor.x, cursor.y, cursor.r, return_speed, noise)
                }
                requestAnimationFrame(() => this._disperseAnimationLoop(canvas, point_arr, cursor, return_speed, noise))
        },

        // assemble animation
        assemble: function(text="ASSEMBLE", x_modifier=100, y_modifier=100, noise=0.5, return_speed=15) {
                text = text.toUpperCase()
                if (typeof(text) !== "string" || text.length < 1) {
                        console.error(`Animation failed to add: text argument should be a character string! (ex: "123")`)
                        // console.log(isNaN(text))
                        // console.log(typeof(text) !== String)
                        // console.log
                        return
                }
                // modifiers are used as coordinates to center the text
                this.x_modifier = x_modifier
                this.y_modifier = y_modifier
                this.c.style.border = `${this.border_width}` + 'px solid black'
                const point_arr = this._assembleInit(this.c, text, this.r, this.border_width)
                // console.log(this.number_coords)
                this.c.addEventListener("click", () =>{
                this._callAssembleAnimationLoop(point_arr, this.c, noise, return_speed)
                })
                this._assembleAnimationLoop(point_arr, this.c, noise, return_speed, true)
                
        },

        _assembleInit: function(canvas, text, r, border_width) {
                const point_arr = []
                let dx = 0, dy = 0
                for (let i = 0; i < text.length; i ++) {
                //     console.log(dx)
                    if (text[i] === " ") {
                        dx += this.horizontal_spacing*r
                    } else if (text[i] === "/") {
                        dy += this.vertical_spacing*r
                        dx = 0
                    } else {
                        let curr_char_coords = this.number_coords(text[i], this.x_modifier, this.y_modifier, this.r)
                        for (let j = 0; j < curr_char_coords.length; j++) {
                                let new_point = new _Point(curr_char_coords[j][0] + dx, curr_char_coords[j][1] + dy, r, canvas, border_width, this.color, this.filled)
                                new_point.x = Math.random() * canvas.width
                                new_point.y = Math.random() * canvas.height
                                if (new_point.x < r+border_width) {
                                        new_point.x += r+border_width
                                } else if (new_point.x > canvas.width - r - border_width) {
                                        new_point.x -= r + border_width
                                }
                                if (new_point.y < r+border_width) {
                                        new_point.y += r+border_width
                                } else if (new_point.y > canvas.height - r - border_width) {
                                        new_point.y -= r + border_width
                                }
                                point_arr.push(new_point)
                                new_point.draw()
                        }
                        dx += 10*r
                        // dy += 4*r
                    }
                }
                // console.log(dx)
                return point_arr
        },

        _callAssembleAnimationLoop: function(point_arr, canvas, noise, return_speed) {
                canvas.removeEventListener("click", this._callAssembleAnimationLoop)
                // console.log("removed")
                if (this.requestId) {
                        window.cancelAnimationFrame(this.requestId)
                        this.requestId = null
                        this._assembleAnimationLoop(point_arr, canvas, noise, return_speed, false)
                }
        },

        _assembleAnimationLoop: function(point_arr, canvas, noise, return_speed, bounce_running) {
                
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
                if (bounce_running) {
                        // console.log("bounce")
                        for (let i = 0; i < point_arr.length; i++) {
                                point_arr[i].update()
                        }
                } else {
                        // console.log("assemble")
                        for (let i = 0; i < point_arr.length; i++) {
                                point_arr[i].assemble_update(noise, return_speed)
                        }
                }
                this.requestId = requestAnimationFrame(() => this._assembleAnimationLoop(point_arr, canvas, noise, return_speed, bounce_running))
                // console.log(this.requestId)
        }
}

// Point class
function _Point(x, y, r, canvas, border_width, color, filled) {
        this.x = x
        this.y = y
        this.dx = Math.random() - Math.random()
        this.dy = Math.random() - Math.random()
        this.max_speed = (Math.random() + 0.1) * 4
        this.canvas_width = canvas.width
        this.canvas_height = canvas.height
        this.ctx = canvas.getContext("2d")
        this.r = r
        this.border_width = border_width
        this.desired_x = x
        this.desired_y = y
        this.weight = (Math.random() * 10) + 1
        if (color === "random") {
            this.color = "#" + Math.floor(Math.random()*16777214).toString(16)
        } else {
            this.color = color
        }
        this.filled = filled
        // console.log(this.desired_x)
        // console.log(this.desired_y)
    }
    
_Point.prototype = {

        draw: function() {
                this.ctx.beginPath()
                this.ctx.arc(this.x, this.y, this.r, Math.PI * 2, false)
                if (this.filled) {
                    this.ctx.fillStyle = this.color
                    this.ctx.fill()
                } else {
                    this.ctx.strokeStyle = this.color
                    this.ctx.stroke()
                }
        },

        update: function() {
                // console.log(this.x)
                // check vertical bounds
                if (Math.abs(this.dx) < this.max_speed) {
                if (this.dx < 0) {
                        this.dx -= 0.01
                } else {
                        this.dx += 0.01
                }
                }
                if (Math.abs(this.dy) < this.max_speed) {
                if (this.dy < 0) {
                        this.dy -= 0.01
                } else {
                        this.dy += 0.01
                }
                }
                if (this.x + this.dx < this.border_width || this.x + this.dx > this.canvas_width - this.border_width) {
                this.dx = -this.dx
                }
                if (this.y + this.dy < this.border_width || this.y + this.dy > this.canvas_height - this.border_width) {
                this.dy = -this.dy
                }
                
                
                this.x += this.dx
                this.y += this.dy
                this.draw()
        },

        scatter_update: function(cursor_x, cursor_y, cursor_r, noise) {
                let dx = cursor_x - this.x
                let dy = cursor_y - this.y
                let dist = Math.sqrt(dx * dx + dy * dy)
                let steering_x_factor = dx / dist
                let steering_y_factor = dy / dist
                let dist_factor = (cursor_r - dist) / cursor_r
                let steering_x_force = this.weight * dist_factor * steering_x_factor
                let steering_y_force = this.weight * dist_factor * steering_y_factor

                // console.log(dist)
                

                // if point is within cursor range, and point won't move out of the canvas
                if (dist < cursor_r + this.r && this.x - steering_x_force < this.canvas_width - this.r && this.x - steering_x_force > this.r && this.y - steering_y_force < this.canvas_height - this.r && this.y - steering_y_force > this.r) {
                        this.x -= steering_x_force
                        this.y -= steering_y_force
                        // update desired x,y so point stays there
                        this.desired_x = this.x
                        this.desired_y = this.y
                } else {
                        // fix turbulance caused by noise
                        if (this.x !== this.desired_x) {
                                this.dx = Math.abs(this.desired_x - this.x)
                                // console.log(this.dx)
                                if (this.x > this.desired_x) {
                                        this.x -= this.dx/(this.weight + 10)
                                // console.log("this.x > this.desired_x")
                                // console.log(this.x - this.desired_x)
                                } else {
                                        this.x += this.dx/(this.weight + 10)
                                // console.log("this.x < this.desired_x")
                                // console.log(this.desired_x - this.x)
                                }
                        }
                        if (this.y !== this.desired_y) {
                                this.dy = Math.abs(this.desired_y - this.y)
                                if (this.y > this.desired_y) {
                                        this.y -= this.dy/(this.weight + 10)
                                } else {
                                        this.y += this.dy/(this.weight + 10)
                                }
                        }
                }

                // add in noise to point
                // console.log(noise)
                if (noise && !isNaN(noise)) {
                        this.x += Math.random() * noise
                        this.y += Math.random() * noise
                // console.log("noise")
                }

                this.draw()
        },

        disperse_update: function(cursor_x, cursor_y, cursor_r, return_speed, noise) {
                let dx = cursor_x - this.x
                let dy = cursor_y - this.y
                let dist = Math.sqrt(dx * dx + dy * dy)
                let steering_x_factor = dx / dist
                let steering_y_factor = dy / dist
                let dist_factor = (cursor_r - dist) / cursor_r
                let steering_x_force = this.weight * dist_factor * steering_x_factor
                let steering_y_force = this.weight * dist_factor * steering_y_factor

                // console.log(dist)
                

                // if point is within cursor range, and point won't move out of the canvas
                if (dist < cursor_r + this.r && this.x - steering_x_force < this.canvas_width - this.r && this.x - steering_x_force > this.r && this.y - steering_y_force < this.canvas_height - this.r && this.y - steering_y_force > this.r) {
                this.x -= steering_x_force
                this.y -= steering_y_force
                } else {
                // move point back to original position
                if (this.x !== this.desired_x) {
                        this.dx = Math.abs(this.desired_x - this.x)
                        // console.log(this.dx)
                        if (this.x > this.desired_x) {
                        this.x -= this.dx/(this.weight + return_speed)
                        // console.log("this.x > this.desired_x")
                        // console.log(this.x - this.desired_x)
                        } else {
                        this.x += this.dx/(this.weight + return_speed)
                        // console.log("this.x < this.desired_x")
                        // console.log(this.desired_x - this.x)
                        }
                }
                if (this.y !== this.desired_y) {
                        this.dy = Math.abs(this.desired_y - this.y)
                        if (this.y > this.desired_y) {
                        this.y -= this.dy/(this.weight + return_speed)
                        } else {
                        this.y += this.dy/(this.weight + return_speed)
                        }
                }
                }

                // add in noise to point
                if (noise && !isNaN(noise)) {
                this.x += Math.random() * noise
                this.y += Math.random() * noise
                // console.log("noise")
                }

                this.draw()
        },

        assemble_update: function(noise, return_speed) {
                // console.log(return_speed)
                // console.log(this.desired_x)
                if (this.x !== this.desired_x) {
                        this.dx = Math.abs(this.desired_x - this.x)
                        // console.log(this.dx)
                        if (this.x > this.desired_x) {
                                this.x -= this.dx/(this.weight + return_speed)
                        // console.log("this.x > this.desired_x")
                        // console.log(this.x - this.desired_x)
                        } else {
                                this.x += this.dx/(this.weight + return_speed)
                        // console.log("this.x < this.desired_x")
                        // console.log(this.desired_x - this.x)
                        }
                }
                if (this.y !== this.desired_y) {
                        this.dy = Math.abs(this.desired_y - this.y)
                        if (this.y > this.desired_y) {
                        this.y -= this.dy/(this.weight + return_speed)
                        } else {
                        this.y += this.dy/(this.weight + return_speed)
                        }
                }
                if (noise && !isNaN(noise)) {
                        this.x += Math.random() * noise
                        this.y += Math.random() * noise
                }
                // console.log(this.x)
                // console.log(this.y)
                this.draw()
        }
}


// // Get the canvas object wish to play the animation on!
// const c = document.querySelectorAll("canvas")[0]
// // or
// const c = document.createElement("canvas") 

// // create an instance of the library, and pass in the canvas object you wish to add animation to!
// const library = new AEB(c) 

// library.textFall("Text Fall") // textFall animation
// library.disperse("Disperse") // disperse animation
// library.assemble("Assemble") // assemble animation
// library.scatter("Scatter") // scatter animation