package wlcp.webapp.spring.controller;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import wlcp.model.master.Username;
import wlcp.webapp.dto.UserDto;

@Controller
@RequestMapping("/Controllers")
public class LoginController {

	@Inject
	EntityManager entityManager;

	@PostMapping(value="/userLogin")
	@ResponseBody
	public ResponseEntity<Boolean> login(@RequestBody UserDto user) { 
		Username username = entityManager.find(Username.class, user.getUsername());
		if(username!=null) {
			
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		}
		else {
			
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}
		
	}
}
