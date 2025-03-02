package com.example.PaperPal.controller;

import com.example.PaperPal.entity.Doubts;
import com.example.PaperPal.service.DoubtsService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/doubts")
public class DoubtsController {


    private DoubtsService doubtsService;

    @Autowired
    public DoubtsController(DoubtsService doubtsService) {
        this.doubtsService=doubtsService;
    }

    @PatchMapping("/addReply")
    public ResponseEntity<DoubtsService.Reply> postDoubtReply(@RequestBody DoubtsService.Reply reply){
        try {
            log.info(reply.toString());
            return new ResponseEntity<>(doubtsService.addReply(reply),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("/getReply/{id}")
    public ResponseEntity<?> getDoubtReply(@PathVariable ObjectId id){
        List<DoubtsService.Reply> replies=doubtsService.getReply(id);
        if(!replies.isEmpty()) {
            return new ResponseEntity<>(replies, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }


    @PostMapping("/postDoubts")
    public ResponseEntity<String> addDoubts(@RequestBody Doubts doubts) {
        log.info(doubts.toString());

        if(doubtsService.addDoubts(doubts)){
            return new ResponseEntity<>("Doubt posted successfully", HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/allDoubts")
    public ResponseEntity<?> getAllDoubts() {
        List<Doubts> doubts= doubtsService.getAllDoubts();
        if(!doubts.isEmpty()) {
            return new ResponseEntity<>(doubts, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteDoubt/{id}")
    public ResponseEntity<String> deleteDoubt(@PathVariable ObjectId id){
        String name=SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isDeleted=doubtsService.deleteDoubtsById(id,name);
        if(isDeleted){
            return new ResponseEntity<>("Doubt deleted successfully", HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/myDoubts")
    public ResponseEntity<List<Doubts>> myDoubts(){

        log.info("Req received..");

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String username=authentication.getName();
        List<Doubts> doubts=doubtsService.getDoubtsByName(username);
        if(!doubts.isEmpty()) {
            return new ResponseEntity<>(doubts, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
