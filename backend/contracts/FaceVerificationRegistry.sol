// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FaceVerificationRegistry
 * @dev Tamper-evident on-chain registry for face identification and reverse-image verification records.
 * Stores cryptographic content hashes, match metadata, similarity scores, and verification status without
 * storing sensitive raw biometric or facial image data on-chain.
 */
contract FaceVerificationRegistry {
    
    enum VerificationStatus {
        Unverified,
        Verified,
        NotVerified,
        NoMatchFound
    }

    struct VerificationRecord {
        bytes32 recordId;
        bytes32 inputImageHash;      // SHA-256 hash of original input image
        bytes32 matchedImageHash;    // SHA-256 hash of discovered match image (0x0 if no match)
        string sourceUrl;            // Public URL or social media post link
        string platform;             // Source platform (e.g., X, Instagram, LinkedIn, Web)
        uint256 similarityScore;     // Similarity in basis points (e.g., 9450 = 94.50%)
        VerificationStatus status;   // Status enum
        uint256 timestamp;           // Block timestamp of registration
        string pipelineVersion;      // Version identifier of verification pipeline
        address recordedBy;          // Submitter address
    }

    // Mapping from recordId (keccak256 hash of audit payload) to VerificationRecord
    mapping(bytes32 => VerificationRecord) public records;
    
    // Array of all registered record IDs for enumeration
    bytes32[] public recordIds;

    // Events for indexing and real-time explorer tracking
    event VerificationRecorded(
        bytes32 indexed recordId,
        bytes32 indexed inputImageHash,
        bytes32 indexed matchedImageHash,
        string sourceUrl,
        string platform,
        uint256 similarityScore,
        VerificationStatus status,
        uint256 timestamp,
        string pipelineVersion,
        address recordedBy
    );

    /**
     * @notice Store a new tamper-evident verification record on-chain.
     */
    function recordVerification(
        bytes32 recordId,
        bytes32 inputImageHash,
        bytes32 matchedImageHash,
        string calldata sourceUrl,
        string calldata platform,
        uint256 similarityScore,
        uint8 status,
        string calldata pipelineVersion
    ) external returns (bool) {
        require(recordId != bytes32(0), "Invalid record ID");
        require(inputImageHash != bytes32(0), "Invalid input image hash");
        require(records[recordId].timestamp == 0, "Record already exists");
        require(status <= uint8(VerificationStatus.NoMatchFound), "Invalid status");

        VerificationRecord memory newRecord = VerificationRecord({
            recordId: recordId,
            inputImageHash: inputImageHash,
            matchedImageHash: matchedImageHash,
            sourceUrl: sourceUrl,
            platform: platform,
            similarityScore: similarityScore,
            status: VerificationStatus(status),
            timestamp: block.timestamp,
            pipelineVersion: pipelineVersion,
            recordedBy: msg.sender
        });

        records[recordId] = newRecord;
        recordIds.push(recordId);

        emit VerificationRecorded(
            recordId,
            inputImageHash,
            matchedImageHash,
            sourceUrl,
            platform,
            similarityScore,
            VerificationStatus(status),
            block.timestamp,
            pipelineVersion,
            msg.sender
        );

        return true;
    }

    /**
     * @notice Retrieve an existing verification record by its recordId.
     */
    function getRecord(bytes32 recordId) external view returns (
        bytes32 inputImageHash,
        bytes32 matchedImageHash,
        string memory sourceUrl,
        string memory platform,
        uint256 similarityScore,
        VerificationStatus status,
        uint256 timestamp,
        string memory pipelineVersion,
        address recordedBy
    ) {
        VerificationRecord memory record = records[recordId];
        require(record.timestamp != 0, "Record not found");
        return (
            record.inputImageHash,
            record.matchedImageHash,
            record.sourceUrl,
            record.platform,
            record.similarityScore,
            record.status,
            record.timestamp,
            record.pipelineVersion,
            record.recordedBy
        );
    }

    /**
     * @notice Get total count of registered records.
     */
    function getTotalRecords() external view returns (uint256) {
        return recordIds.length;
    }

    /**
     * @notice Verify whether a given record ID matches on-chain input and match hashes.
     */
    function verifyHashes(
        bytes32 recordId,
        bytes32 expectedInputHash,
        bytes32 expectedMatchedHash
    ) external view returns (bool) {
        VerificationRecord memory record = records[recordId];
        if (record.timestamp == 0) return false;
        return (record.inputImageHash == expectedInputHash && record.matchedImageHash == expectedMatchedHash);
    }
}
