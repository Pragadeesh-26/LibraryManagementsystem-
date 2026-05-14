package com.Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.model.Member;

public interface MemberRepository extends JpaRepository<Member, Integer> {}
