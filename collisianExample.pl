local g = display.newGroup()
local c1,c2

--x10, y10 is centre point of rect1. x20, y20 is centre point of rect2
--height1, width1 are half heights/widths of rect1, radrot is rotation of rect in radians
local function isCollision( obj, obj2 )
				
			local cos = math.cos
			local sin = math.sin
			local asin = math.asin
			local sqrt = math.sqrt
			local rad = math.rad
			local pi = math.pi
			
			
			local x10 = obj.x
			local y10 = obj.y

			local r = obj.rotation
			obj.rotation = 0
			local height1 = obj._height/2
			local width1 = obj._width/2
			obj.rotation = r
			
			local radrot1 = rad(obj.rotation)

			local x20 = obj2.x
			local y20 = obj2.y

			r = obj2.rotation
			obj2.rotation = 0
			local height2 = obj2._height/2
			local width2 = obj2._width/2
			obj2.rotation = r
			
			local radrot2 = rad(obj2.rotation)


			local radius1 = sqrt( height1*height1 + width1*width1 )
			local radius2 = sqrt( height2*height2 + width2*width2 )




			local radius1 = sqrt( height1*height1 + width1*width1 )
			local radius2 = sqrt( height2*height2 + width2*width2 )

			local angle1 = asin( height1 / radius1 )
			local angle2 = asin( height2 / radius2 )

			local x1 = {}; local y1 = {}
			local x2 = {}; local y2 = {}

			x1[1] = x10 + radius1 * cos(radrot1 - angle1); y1[1] = y10 + radius1 * sin(radrot1 - angle1)
			x1[2] = x10 + radius1 * cos(radrot1 + angle1); y1[2] = y10 + radius1 * sin(radrot1 + angle1)
			x1[3] = x10 + radius1 * cos(radrot1 + pi - angle1); y1[3] = y10 + radius1 * sin(radrot1 + pi - angle1)
			x1[4] = x10 + radius1 * cos(radrot1 + pi + angle1); y1[4] = y10 + radius1 * sin(radrot1 + pi + angle1)

			x2[1] = x20 + radius2 * cos(radrot2 - angle2); y2[1] = y20 + radius2 * sin(radrot2 - angle2)
			x2[2] = x20 + radius2 * cos(radrot2 + angle2); y2[2] = y20 + radius2 * sin(radrot2 + angle2)
			x2[3] = x20 + radius2 * cos(radrot2 + pi - angle2); y2[3] = y20 + radius2 * sin(radrot2 + pi - angle2)
			x2[4] = x20 + radius2 * cos(radrot2 + pi + angle2); y2[4] = y20 + radius2 * sin(radrot2 + pi + angle2)

			local axisx = {}; local axisy = {}

			axisx[1] = x1[1] - x1[2]; axisy[1] = y1[1] - y1[2]
			axisx[2] = x1[3] - x1[2]; axisy[2] = y1[3] - y1[2]

			axisx[3] = x2[1] - x2[2]; axisy[3] = y2[1] - y2[2]
			axisx[4] = x2[3] - x2[2]; axisy[4] = y2[3] - y2[2]

			for k = 1,4 do

				local proj = x1[1] * axisx[k] + y1[1] * axisy[k]

				local minProj1 = proj
				local maxProj1 = proj

				for i = 2,4 do
					proj = x1[i] * axisx[k] + y1[i] * axisy[k]

					if proj < minProj1 then
						minProj1 = proj
					elseif proj > maxProj1 then
						maxProj1 = proj
					end

				end

				proj = x2[1] * axisx[k] + y2[1] * axisy[k]

				local minProj2 = proj
				local maxProj2 = proj

				for j = 2,4 do
					proj = x2[j] * axisx[k] + y2[j] * axisy[k]

					if proj < minProj2 then
						minProj2 = proj
					elseif proj > maxProj2 then
						maxProj2 = proj
					end

				end

				if maxProj2 < minProj1 or maxProj1 < minProj2 then
					return false
				end
			end

			return true

		end
		



local b = display.newRect(0,0, 500,300)
b.x = 500
b.y = 300
b._height = b.contentHeight
b._width = b.contentWidth

b.rotation = 0
b:setFillColor(.5, .5, 1, .5)


local shape1 = display.newRect(0,0, 200,100)
shape1.x = 0
shape1.y = 0

shape1._height = shape1.contentHeight
shape1._width = shape1.contentWidth

shape1.rotation = 20
b:setFillColor(1, .5, .5, .5)


print( "contentHeight: ".. shape1.contentHeight )

function shapeMove( event )

	local phase  = event.phase
	if phase == "began" then
		display.getCurrentStage():setFocus( self, event.id )
		shape1.isFocus = true
	elseif shape1.isFocus then
		if phase == "moved" then

			-- Move the shape
			shape1.x = event.x
			shape1.y = event.y
			
			if ( isCollision(shape1, b) ) then
				print ("Collision")
				shape1:setFillColor(250,0,0)
			else
				shape1:setFillColor(250,250,250,100)
			end


		elseif phase == "ended" then
			display.getCurrentStage():setFocus( self, nil )
			shape1.isFocus = false
		end
	end
	
end




Runtime:addEventListener( "touch", shapeMove )